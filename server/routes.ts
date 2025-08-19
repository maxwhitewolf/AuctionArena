import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertRoomSchema, insertRoomMemberSchema, insertRoomTeamSchema, IPL_TEAMS, ROOM_STATUS, STARTING_PURSE_L, TEAM_MAX, TEAM_MIN, type TeamCode, getMinIncrement, expectedNextAmount, isTeamActive } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Create room
  app.post("/api/rooms", async (req, res) => {
    try {
      const { roomName, username } = req.body;
      
      if (!roomName || !username) {
        return res.status(400).json({ message: "Room name and username are required" });
      }

      // Check member limit
      const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const room = await storage.createRoom({
        name: roomName,
        hostUserId: userId,
        status: ROOM_STATUS.LOBBY,
        countdownSeconds: 30,
      });

      const member = await storage.addRoomMember({
        roomId: room.id,
        userId,
        username,
        role: 'host',
        selectionOrder: 1,
        hasEnded: false,
      });

      res.json({ room, userId, member });
    } catch (error) {
      console.error('Error creating room:', error);
      res.status(500).json({ message: "Failed to create room" });
    }
  });

  // Join room
  app.post("/api/rooms/join", async (req, res) => {
    try {
      const { roomCode, username } = req.body;
      
      if (!roomCode || !username) {
        return res.status(400).json({ message: "Room code and username are required" });
      }

      const room = await storage.getRoomByCode(roomCode.toUpperCase());
      if (!room) {
        return res.status(404).json({ message: "Room not found" });
      }

      if (room.status !== ROOM_STATUS.LOBBY) {
        return res.status(400).json({ message: "Room is not accepting new members" });
      }

      const existingMembers = await storage.getRoomMembers(room.id);
      const teamMembers = existingMembers.filter(m => m.role === 'team' || m.role === 'host');
      
      // Enforce max 10 players
      if (teamMembers.length >= 10) {
        return res.status(400).json({ message: "Room is full (maximum 10 players)" });
      }

      const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const member = await storage.addRoomMember({
        roomId: room.id,
        userId,
        username,
        role: 'team',
        selectionOrder: existingMembers.length + 1,
        hasEnded: false,
      });

      res.json({ room, userId, member });
    } catch (error) {
      console.error('Error joining room:', error);
      res.status(500).json({ message: "Failed to join room" });
    }
  });

  // Get room with members and teams
  app.get("/api/rooms/:code", async (req, res) => {
    try {
      const room = await storage.getRoomByCode(req.params.code.toUpperCase());
      if (!room) {
        return res.status(404).json({ message: "Room not found" });
      }

      const members = await storage.getRoomMembers(room.id);
      const teams = await storage.getRoomTeams(room.id);
      
      let currentPlayer = undefined;
      if (room.currentPlayerId) {
        currentPlayer = await storage.getPlayerById(room.currentPlayerId);
      }

      res.json({ room, members, teams, currentPlayer });
    } catch (error) {
      console.error('Error getting room:', error);
      res.status(500).json({ message: "Failed to get room" });
    }
  });

  // Start team selection
  app.post("/api/rooms/:code/start-team-selection", async (req, res) => {
    try {
      const { userId } = req.body;
      const room = await storage.getRoomByCode(req.params.code.toUpperCase());
      
      if (!room) {
        return res.status(404).json({ message: "Room not found" });
      }

      if (room.hostUserId !== userId) {
        return res.status(403).json({ message: "Only host can start team selection" });
      }

      if (room.status !== ROOM_STATUS.LOBBY) {
        return res.status(400).json({ message: "Room is not in lobby state" });
      }

      const members = await storage.getRoomMembers(room.id);
      const teamMembers = members.filter(m => m.role === 'team' || m.role === 'host');
      
      if (teamMembers.length < 2) {
        return res.status(400).json({ message: "Need at least 2 players to start" });
      }

      await storage.updateRoom(room.id, { status: ROOM_STATUS.TEAM_SELECTION });
      
      res.json({ message: "Team selection started" });
    } catch (error) {
      console.error('Error starting team selection:', error);
      res.status(500).json({ message: "Failed to start team selection" });
    }
  });

  // Select team
  app.post("/api/rooms/:code/select-team", async (req, res) => {
    try {
      const { userId, teamCode } = req.body;
      const room = await storage.getRoomByCode(req.params.code.toUpperCase());
      
      if (!room) {
        return res.status(404).json({ message: "Room not found" });
      }

      if (room.status !== ROOM_STATUS.TEAM_SELECTION) {
        return res.status(400).json({ message: "Room is not in team selection state" });
      }

      if (!IPL_TEAMS.includes(teamCode)) {
        return res.status(400).json({ message: "Invalid team code" });
      }

      const existingTeams = await storage.getRoomTeams(room.id);
      if (existingTeams.some(t => t.teamCode === teamCode)) {
        return res.status(400).json({ message: "Team already selected" });
      }

      const members = await storage.getRoomMembers(room.id);
      const member = members.find(m => m.userId === userId);
      
      if (!member) {
        return res.status(404).json({ message: "User not found in room" });
      }

      if (existingTeams.some(t => t.userId === userId)) {
        return res.status(400).json({ message: "User already selected a team" });
      }

      const team = await storage.addRoomTeam({
        roomId: room.id,
        teamCode,
        userId,
        username: member.username,
        selectionOrder: member.selectionOrder!,
        purseLeft: STARTING_PURSE_L,
        totalCount: 0,
        overseasCount: 0,
        hasEnded: false,
      });

      res.json({ team });
    } catch (error) {
      console.error('Error selecting team:', error);
      res.status(500).json({ message: "Failed to select team" });
    }
  });

  // Start auction
  app.post("/api/rooms/:code/start-auction", async (req, res) => {
    try {
      const { userId } = req.body;
      const room = await storage.getRoomByCode(req.params.code.toUpperCase());
      
      if (!room) {
        return res.status(404).json({ message: "Room not found" });
      }

      if (room.hostUserId !== userId) {
        return res.status(403).json({ message: "Only host can start auction" });
      }

      if (room.status !== ROOM_STATUS.TEAM_SELECTION) {
        return res.status(400).json({ message: "Room is not in team selection state" });
      }

      const teams = await storage.getRoomTeams(room.id);
      if (teams.length < 2) {
        return res.status(400).json({ message: "Need at least 2 teams to start auction" });
      }

      // Initialize player queue
      await storage.initializePlayerQueue(room.id);
      
      // Get first player
      const queue = await storage.getPlayerQueue(room.id);
      const firstPlayer = queue[0];

      if (firstPlayer) {
        await storage.updatePlayerQueue(room.id, firstPlayer.playerId, { 
          isAuctioning: true,
          status: 'auctioning'
        });

        const deadline = new Date(Date.now() + room.countdownSeconds * 1000);
        
        await storage.updateRoom(room.id, { 
          status: ROOM_STATUS.LIVE,
          currentPlayerId: firstPlayer.playerId,
          currentDeadlineAt: deadline,
        });
      }

      res.json({ message: "Auction started" });
    } catch (error) {
      console.error('Error starting auction:', error);
      res.status(500).json({ message: "Failed to start auction" });
    }
  });

  // Get auction state
  app.get("/api/rooms/:code/auction", async (req, res) => {
    try {
      const room = await storage.getRoomByCode(req.params.code.toUpperCase());
      if (!room) {
        return res.status(404).json({ message: "Room not found" });
      }

      let currentPlayer = undefined;
      let lastBid = undefined;
      let bids: any[] = [];
      let skips: any[] = [];

      if (room.currentPlayerId) {
        currentPlayer = await storage.getPlayerById(room.currentPlayerId);
        lastBid = await storage.getLastBid(room.id, room.currentPlayerId);
        bids = await storage.getBidsForPlayer(room.id, room.currentPlayerId);
        skips = await storage.getSkips(room.id, room.currentPlayerId);
      }

      const teams = await storage.getRoomTeams(room.id);
      const isActive = room.status === ROOM_STATUS.LIVE;
      
      let nextMinBid = undefined;
      if (currentPlayer) {
        nextMinBid = expectedNextAmount(lastBid, currentPlayer.basePrice);
      }

      res.json({
        room,
        currentPlayer,
        lastBid,
        bids,
        teams,
        skips,
        isActive,
        nextMinBid
      });
    } catch (error) {
      console.error('Error getting auction state:', error);
      res.status(500).json({ message: "Failed to get auction state" });
    }
  });

  // Place bid
  app.post("/api/rooms/:code/bid", async (req, res) => {
    try {
      const { userId, amount, version } = req.body;
      const room = await storage.getRoomByCode(req.params.code.toUpperCase());
      
      if (!room) {
        return res.status(404).json({ message: "Room not found" });
      }

      if (room.status !== ROOM_STATUS.LIVE) {
        return res.status(400).json({ message: "Auction is not live" });
      }

      if (!room.currentPlayerId) {
        return res.status(400).json({ message: "No current player" });
      }

      if (room.currentDeadlineAt && new Date() > room.currentDeadlineAt) {
        return res.status(400).json({ message: "Bidding time expired" });
      }

      // Optimistic concurrency check
      if (version !== undefined && version !== room.version) {
        return res.status(409).json({ message: "Bid version conflict, please refresh" });
      }

      const teams = await storage.getRoomTeams(room.id);
      const userTeam = teams.find(t => t.userId === userId);
      
      if (!userTeam) {
        return res.status(404).json({ message: "User team not found" });
      }

      const currentPlayer = await storage.getPlayerById(room.currentPlayerId);
      if (!currentPlayer) {
        return res.status(404).json({ message: "Current player not found" });
      }

      // Check if team is active
      const lastBid = await storage.getLastBid(room.id, room.currentPlayerId);
      const teamActive = isTeamActive(userTeam, currentPlayer, lastBid);
      if (!teamActive) {
        return res.status(400).json({ message: "Team is not active for bidding" });
      }

      const expectedAmount = expectedNextAmount(lastBid, currentPlayer.basePrice);

      if (amount !== expectedAmount) {
        return res.status(400).json({ 
          message: `Invalid bid amount. Expected: ${expectedAmount}L` 
        });
      }

      if (userTeam.purseLeft < amount) {
        return res.status(400).json({ message: "Insufficient purse balance" });
      }

      // Place bid
      const bid = await storage.placeBid({
        roomId: room.id,
        playerId: room.currentPlayerId,
        teamCode: userTeam.teamCode,
        amount,
      });

      // Extend deadline and increment version
      const newDeadline = new Date(Date.now() + room.countdownSeconds * 1000);
      await storage.updateRoom(room.id, { 
        currentDeadlineAt: newDeadline,
        version: room.version + 1,
      });

      res.json({ bid, newDeadline, version: room.version + 1 });
    } catch (error) {
      console.error('Error placing bid:', error);
      res.status(500).json({ message: "Failed to place bid" });
    }
  });

  // Skip current player
  app.post("/api/rooms/:code/skip", async (req, res) => {
    try {
      const { userId } = req.body;
      const room = await storage.getRoomByCode(req.params.code.toUpperCase());
      
      if (!room) {
        return res.status(404).json({ message: "Room not found" });
      }

      if (room.status !== ROOM_STATUS.LIVE || !room.currentPlayerId) {
        return res.status(400).json({ message: "No active auction" });
      }

      const teams = await storage.getRoomTeams(room.id);
      const userTeam = teams.find(t => t.userId === userId);
      
      if (!userTeam) {
        return res.status(404).json({ message: "User team not found" });
      }

      const currentPlayer = await storage.getPlayerById(room.currentPlayerId);
      if (!currentPlayer) {
        return res.status(404).json({ message: "Current player not found" });
      }

      // Check if team is active
      const lastBid = await storage.getLastBid(room.id, room.currentPlayerId);
      const teamActive = isTeamActive(userTeam, currentPlayer, lastBid);
      if (!teamActive) {
        return res.status(400).json({ message: "Team is not active for skipping" });
      }

      const skip = await storage.addSkip(room.id, room.currentPlayerId, userTeam.teamCode as TeamCode);

      // Check if all active teams have skipped and no bid exists
      if (!lastBid) {
        // Check if all active teams have skipped
        const allActiveTeams = teams.filter(team => isTeamActive(team, currentPlayer, lastBid));
        const skips = await storage.getSkips(room.id, room.currentPlayerId);
        const skippedTeamCodes = skips.map(s => s.teamCode);
        
        const allSkipped = allActiveTeams.every(team => skippedTeamCodes.includes(team.teamCode));
        
        if (allSkipped) {
          // Mark player as unsold and advance immediately
          await storage.updatePlayerQueue(room.id, room.currentPlayerId, { 
            status: 'unsold',
            isAuctioning: false
          });
          
          await storage.clearSkips(room.id, room.currentPlayerId);
          
          // Move to next player or end auction
          const queue = await storage.getPlayerQueue(room.id);
          const nextPlayer = queue.find(q => q.status === 'queued');
          
          if (nextPlayer) {
            await storage.updatePlayerQueue(room.id, nextPlayer.playerId, { 
              isAuctioning: true,
              status: 'auctioning'
            });

            const deadline = new Date(Date.now() + room.countdownSeconds * 1000);
            await storage.updateRoom(room.id, { 
              currentPlayerId: nextPlayer.playerId,
              currentDeadlineAt: deadline,
            });
          } else {
            // End auction
            await storage.updateRoom(room.id, { 
              status: ROOM_STATUS.ENDED,
              currentPlayerId: null,
              currentDeadlineAt: null,
            });
          }
        }
      }

      res.json({ skip });
    } catch (error) {
      console.error('Error skipping:', error);
      res.status(500).json({ message: "Failed to skip" });
    }
  });

  // End team bidding
  app.post("/api/rooms/:code/end-bidding", async (req, res) => {
    try {
      const { userId } = req.body;
      const room = await storage.getRoomByCode(req.params.code.toUpperCase());
      
      if (!room) {
        return res.status(404).json({ message: "Room not found" });
      }

      const teams = await storage.getRoomTeams(room.id);
      const userTeam = teams.find(t => t.userId === userId);
      
      if (!userTeam) {
        return res.status(404).json({ message: "User team not found" });
      }

      if (userTeam.totalCount < TEAM_MIN) {
        return res.status(400).json({ 
          message: `Need at least ${TEAM_MIN} players to end bidding` 
        });
      }

      await storage.updateRoomTeam(room.id, userTeam.teamCode, { hasEnded: true });

      // Check if all teams have ended
      const updatedTeams = await storage.getRoomTeams(room.id);
      const allEnded = updatedTeams.every(t => t.hasEnded);
      
      if (allEnded) {
        await storage.updateRoom(room.id, { 
          status: ROOM_STATUS.ENDED,
          currentPlayerId: null,
          currentDeadlineAt: null,
        });
      }

      res.json({ message: "Bidding ended for team" });
    } catch (error) {
      console.error('Error ending bidding:', error);
      res.status(500).json({ message: "Failed to end bidding" });
    }
  });

  // Finalize current player (award or unsold)
  app.post("/api/rooms/:code/finalize", async (req, res) => {
    try {
      const room = await storage.getRoomByCode(req.params.code.toUpperCase());
      
      if (!room) {
        return res.status(404).json({ message: "Room not found" });
      }

      if (room.status !== ROOM_STATUS.LIVE || !room.currentPlayerId) {
        return res.status(400).json({ message: "No active auction" });
      }

      if (room.currentDeadlineAt && new Date() < room.currentDeadlineAt) {
        return res.status(400).json({ message: "Timer has not expired yet" });
      }

      const currentPlayer = await storage.getPlayerById(room.currentPlayerId);
      if (!currentPlayer) {
        return res.status(404).json({ message: "Current player not found" });
      }

      const lastBid = await storage.getLastBid(room.id, room.currentPlayerId);
      
      if (lastBid) {
        // SOLD - award to highest bidder
        const teams = await storage.getRoomTeams(room.id);
        const winningTeam = teams.find(t => t.teamCode === lastBid.teamCode);
        
        if (winningTeam) {
          await storage.updateRoomTeam(room.id, lastBid.teamCode, {
            purseLeft: winningTeam.purseLeft - lastBid.amount,
            totalCount: winningTeam.totalCount + 1,
            overseasCount: currentPlayer.nationality !== 'India' 
              ? winningTeam.overseasCount + 1
              : winningTeam.overseasCount,
          });

          await storage.addSquadPlayer(room.id, lastBid.teamCode as TeamCode, room.currentPlayerId, lastBid.amount);
        }
        
        await storage.updatePlayerQueue(room.id, room.currentPlayerId, { status: 'sold', isAuctioning: false });
      } else {
        // UNSOLD
        await storage.updatePlayerQueue(room.id, room.currentPlayerId, { status: 'unsold', isAuctioning: false });
      }

      // Clear skips
      await storage.clearSkips(room.id, room.currentPlayerId);

      // Move to next player or end auction
      const queue = await storage.getPlayerQueue(room.id);
      const nextPlayer = queue.find(q => q.status === 'queued');
      
      if (nextPlayer) {
        await storage.updatePlayerQueue(room.id, nextPlayer.playerId, { 
          isAuctioning: true,
          status: 'auctioning'
        });

        const deadline = new Date(Date.now() + room.countdownSeconds * 1000);
        await storage.updateRoom(room.id, { 
          currentPlayerId: nextPlayer.playerId,
          currentDeadlineAt: deadline,
        });
      } else {
        // End auction
        await storage.updateRoom(room.id, { 
          status: ROOM_STATUS.ENDED,
          currentPlayerId: null,
          currentDeadlineAt: null,
        });
      }

      res.json({ message: lastBid ? "Player sold" : "Player unsold" });
    } catch (error) {
      console.error('Error finalizing:', error);
      res.status(500).json({ message: "Failed to finalize player" });
    }
  });

  // Force next turn (host only)
  app.post("/api/rooms/:code/force-next", async (req, res) => {
    try {
      const { userId } = req.body;
      const room = await storage.getRoomByCode(req.params.code.toUpperCase());
      
      if (!room) {
        return res.status(404).json({ message: "Room not found" });
      }

      if (room.hostUserId !== userId) {
        return res.status(403).json({ message: "Only host can force next turn" });
      }

      if (room.status === ROOM_STATUS.TEAM_SELECTION) {
        // Force next team selection
        const teams = await storage.getRoomTeams(room.id);
        const members = await storage.getRoomMembers(room.id);
        const teamMembers = members.filter(m => m.role === 'team' || m.role === 'host');
        
        if (teams.length < teamMembers.length) {
          // Skip current player's turn by marking them as having selected a random available team
          const availableTeams = IPL_TEAMS.filter(code => !teams.some(t => t.teamCode === code));
          if (availableTeams.length > 0) {
            const currentMember = teamMembers.find(m => m.selectionOrder === teams.length + 1);
            if (currentMember) {
              await storage.addRoomTeam({
                roomId: room.id,
                teamCode: availableTeams[0],
                userId: currentMember.userId,
                username: currentMember.username,
                selectionOrder: currentMember.selectionOrder!,
                purseLeft: STARTING_PURSE_L,
                totalCount: 0,
                overseasCount: 0,
                hasEnded: false,
              });
            }
          }
        }
      } else if (room.status === ROOM_STATUS.LIVE && room.currentDeadlineAt) {
        // Force finalize current player
        await storage.updateRoom(room.id, { 
          currentDeadlineAt: new Date(Date.now() - 1000) // Set deadline to past
        });
      }

      res.json({ message: "Forced next turn" });
    } catch (error) {
      console.error('Error forcing next turn:', error);
      res.status(500).json({ message: "Failed to force next turn" });
    }
  });

  // Get summary
  app.get("/api/rooms/:code/summary", async (req, res) => {
    try {
      const room = await storage.getRoomByCode(req.params.code.toUpperCase());
      if (!room) {
        return res.status(404).json({ message: "Room not found" });
      }

      const teams = await storage.getRoomTeams(room.id);
      const allPlayers = await storage.getAllPlayers();
      
      const teamSummaries = await Promise.all(teams.map(async (team) => {
        const squadPlayers = await storage.getSquadPlayers(room.id, team.teamCode as TeamCode);
        const playersWithDetails = squadPlayers.map(sp => ({
          ...sp,
          player: allPlayers.find(p => p.id === sp.playerId)!
        }));

        return {
          ...team,
          players: playersWithDetails
        };
      }));

      res.json({ teams: teamSummaries });
    } catch (error) {
      console.error('Error getting summary:', error);
      res.status(500).json({ message: "Failed to get summary" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}