import { type Room, type InsertRoom, type RoomMember, type InsertRoomMember, type RoomTeam, type InsertRoomTeam, type Player, type InsertPlayer, type Bid, type InsertBid, type Skip, type SquadPlayer, type PlayerQueue, IPL_TEAMS, PLAYER_ROLES, STARTING_PURSE_L, ROOM_STATUS, type PlayerRole, type TeamCode } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Room operations
  createRoom(room: InsertRoom): Promise<Room>;
  getRoomByCode(code: string): Promise<Room | undefined>;
  updateRoom(id: string, updates: Partial<Room>): Promise<Room | undefined>;
  
  // Room member operations
  addRoomMember(member: InsertRoomMember): Promise<RoomMember>;
  getRoomMembers(roomId: string): Promise<RoomMember[]>;
  updateRoomMember(id: string, updates: Partial<RoomMember>): Promise<RoomMember | undefined>;
  
  // Room team operations
  addRoomTeam(team: InsertRoomTeam): Promise<RoomTeam>;
  getRoomTeams(roomId: string): Promise<RoomTeam[]>;
  updateRoomTeam(roomId: string, teamCode: string, updates: Partial<RoomTeam>): Promise<RoomTeam | undefined>;
  
  // Player operations
  getAllPlayers(): Promise<Player[]>;
  getPlayerById(id: string): Promise<Player | undefined>;
  
  // Player queue operations
  initializePlayerQueue(roomId: string): Promise<void>;
  getPlayerQueue(roomId: string): Promise<PlayerQueue[]>;
  updatePlayerQueue(roomId: string, playerId: string, updates: Partial<PlayerQueue>): Promise<void>;
  
  // Bid operations
  placeBid(bid: InsertBid): Promise<Bid>;
  getBidsForPlayer(roomId: string, playerId: string): Promise<Bid[]>;
  getLastBid(roomId: string, playerId: string): Promise<Bid | undefined>;
  
  // Skip operations
  addSkip(roomId: string, playerId: string, teamCode: TeamCode): Promise<Skip>;
  getSkips(roomId: string, playerId: string): Promise<Skip[]>;
  clearSkips(roomId: string, playerId: string): Promise<void>;
  
  // Squad operations
  addSquadPlayer(roomId: string, teamCode: TeamCode, playerId: string, price: number): Promise<SquadPlayer>;
  getSquadPlayers(roomId: string, teamCode?: TeamCode): Promise<SquadPlayer[]>;
}

export class MemStorage implements IStorage {
  private rooms: Map<string, Room> = new Map();
  private roomMembers: Map<string, RoomMember> = new Map();
  private roomTeams: Map<string, RoomTeam> = new Map();
  private players: Map<string, Player> = new Map();
  private playerQueue: Map<string, PlayerQueue> = new Map();
  private bids: Map<string, Bid> = new Map();
  private skips: Map<string, Skip> = new Map();
  private squadPlayers: Map<string, SquadPlayer> = new Map();

  constructor() {
    this.initializePlayers();
  }

  private initializePlayers() {
    // Sample IPL players data
    const playersData: Array<{ name: string; role: PlayerRole; nationality: string; basePrice: number }> = [
      { name: "Virat Kohli", role: "Batsman", nationality: "India", basePrice: 200 },
      { name: "MS Dhoni", role: "Wicket-Keeper", nationality: "India", basePrice: 200 },
      { name: "Rohit Sharma", role: "Batsman", nationality: "India", basePrice: 200 },
      { name: "Jasprit Bumrah", role: "Bowler", nationality: "India", basePrice: 200 },
      { name: "Ravindra Jadeja", role: "All-Rounder", nationality: "India", basePrice: 200 },
      { name: "KL Rahul", role: "Wicket-Keeper", nationality: "India", basePrice: 200 },
      { name: "Hardik Pandya", role: "All-Rounder", nationality: "India", basePrice: 200 },
      { name: "Shikhar Dhawan", role: "Batsman", nationality: "India", basePrice: 200 },
      { name: "Yuzvendra Chahal", role: "Bowler", nationality: "India", basePrice: 100 },
      { name: "David Warner", role: "Batsman", nationality: "Australia", basePrice: 200 },
      { name: "Kane Williamson", role: "Batsman", nationality: "New Zealand", basePrice: 200 },
      { name: "Jos Buttler", role: "Wicket-Keeper", nationality: "England", basePrice: 200 },
      { name: "Andre Russell", role: "All-Rounder", nationality: "West Indies", basePrice: 200 },
      { name: "Rashid Khan", role: "Bowler", nationality: "Afghanistan", basePrice: 200 },
      { name: "Kagiso Rabada", role: "Bowler", nationality: "South Africa", basePrice: 200 },
      { name: "Pat Cummins", role: "Bowler", nationality: "Australia", basePrice: 200 },
      { name: "Glenn Maxwell", role: "All-Rounder", nationality: "Australia", basePrice: 200 },
      { name: "Faf du Plessis", role: "Batsman", nationality: "South Africa", basePrice: 150 },
      { name: "Sunil Narine", role: "All-Rounder", nationality: "West Indies", basePrice: 100 },
      { name: "Trent Boult", role: "Bowler", nationality: "New Zealand", basePrice: 150 },
      { name: "Shubman Gill", role: "Batsman", nationality: "India", basePrice: 100 },
      { name: "Rishabh Pant", role: "Wicket-Keeper", nationality: "India", basePrice: 200 },
      { name: "Ruturaj Gaikwad", role: "Batsman", nationality: "India", basePrice: 100 },
      { name: "Prithvi Shaw", role: "Batsman", nationality: "India", basePrice: 75 },
      { name: "Ishan Kishan", role: "Wicket-Keeper", nationality: "India", basePrice: 100 },
    ];

    playersData.forEach(playerData => {
      const id = randomUUID();
      const player: Player = {
        id,
        ...playerData,
        stats: null,
      };
      this.players.set(id, player);
    });
  }

  // Helper method to generate room codes
  private generateRoomCode(): string {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  async createRoom(insertRoom: InsertRoom): Promise<Room> {
    const id = randomUUID();
    const code = this.generateRoomCode();
    const room: Room = {
      id,
      code,
      ...insertRoom,
      status: insertRoom.status || ROOM_STATUS.LOBBY,
      countdownSeconds: insertRoom.countdownSeconds || 30,
      currentPlayerId: null,
      currentDeadlineAt: null,
      version: 0,
      createdAt: new Date(),
    };
    this.rooms.set(id, room);
    return room;
  }

  async getRoomByCode(code: string): Promise<Room | undefined> {
    return Array.from(this.rooms.values()).find(room => room.code === code);
  }

  async updateRoom(id: string, updates: Partial<Room>): Promise<Room | undefined> {
    const room = this.rooms.get(id);
    if (!room) return undefined;
    
    const updatedRoom = { ...room, ...updates };
    this.rooms.set(id, updatedRoom);
    return updatedRoom;
  }

  async addRoomMember(insertMember: InsertRoomMember): Promise<RoomMember> {
    const id = randomUUID();
    const member: RoomMember = {
      id,
      ...insertMember,
      role: insertMember.role || 'team',
      selectionOrder: insertMember.selectionOrder || null,
      hasEnded: insertMember.hasEnded || false,
      joinedAt: new Date(),
    };
    this.roomMembers.set(id, member);
    return member;
  }

  async getRoomMembers(roomId: string): Promise<RoomMember[]> {
    return Array.from(this.roomMembers.values())
      .filter(member => member.roomId === roomId)
      .sort((a, b) => a.joinedAt.getTime() - b.joinedAt.getTime());
  }

  async updateRoomMember(id: string, updates: Partial<RoomMember>): Promise<RoomMember | undefined> {
    const member = this.roomMembers.get(id);
    if (!member) return undefined;
    
    const updatedMember = { ...member, ...updates };
    this.roomMembers.set(id, updatedMember);
    return updatedMember;
  }

  async addRoomTeam(insertTeam: InsertRoomTeam): Promise<RoomTeam> {
    const id = randomUUID();
    const team: RoomTeam = {
      id,
      ...insertTeam,
      teamCode: insertTeam.teamCode,
      purseLeft: insertTeam.purseLeft || STARTING_PURSE_L,
      totalCount: insertTeam.totalCount || 0,
      overseasCount: insertTeam.overseasCount || 0,
      hasEnded: insertTeam.hasEnded || false,
    };
    this.roomTeams.set(id, team);
    return team;
  }

  async getRoomTeams(roomId: string): Promise<RoomTeam[]> {
    return Array.from(this.roomTeams.values())
      .filter(team => team.roomId === roomId)
      .sort((a, b) => a.selectionOrder - b.selectionOrder);
  }

  async updateRoomTeam(roomId: string, teamCode: string, updates: Partial<RoomTeam>): Promise<RoomTeam | undefined> {
    const team = Array.from(this.roomTeams.values())
      .find(t => t.roomId === roomId && t.teamCode === teamCode);
    
    if (!team) return undefined;
    
    const updatedTeam = { ...team, ...updates };
    this.roomTeams.set(team.id, updatedTeam);
    return updatedTeam;
  }

  async getAllPlayers(): Promise<Player[]> {
    return Array.from(this.players.values());
  }

  async getPlayerById(id: string): Promise<Player | undefined> {
    return this.players.get(id);
  }

  async initializePlayerQueue(roomId: string): Promise<void> {
    const players = Array.from(this.players.values());
    
    // Shuffle players for random order
    const shuffledPlayers = players.sort(() => Math.random() - 0.5);
    
    shuffledPlayers.forEach((player, index) => {
      const id = randomUUID();
      const queueItem: PlayerQueue = {
        id,
        roomId,
        playerId: player.id,
        queueOrder: index + 1,
        status: 'queued',
        isAuctioning: false,
      };
      this.playerQueue.set(id, queueItem);
    });
  }

  async getPlayerQueue(roomId: string): Promise<PlayerQueue[]> {
    return Array.from(this.playerQueue.values())
      .filter(item => item.roomId === roomId)
      .sort((a, b) => a.queueOrder - b.queueOrder);
  }

  async updatePlayerQueue(roomId: string, playerId: string, updates: Partial<PlayerQueue>): Promise<void> {
    const queueItem = Array.from(this.playerQueue.values())
      .find(item => item.roomId === roomId && item.playerId === playerId);
    
    if (queueItem) {
      const updatedItem = { ...queueItem, ...updates };
      this.playerQueue.set(queueItem.id, updatedItem);
    }
  }

  async placeBid(insertBid: InsertBid): Promise<Bid> {
    const id = randomUUID();
    const bid: Bid = {
      id,
      ...insertBid,
      teamCode: insertBid.teamCode,
      placedAt: new Date(),
    };
    this.bids.set(id, bid);
    return bid;
  }

  async getBidsForPlayer(roomId: string, playerId: string): Promise<Bid[]> {
    return Array.from(this.bids.values())
      .filter(bid => bid.roomId === roomId && bid.playerId === playerId)
      .sort((a, b) => b.placedAt.getTime() - a.placedAt.getTime());
  }

  async getLastBid(roomId: string, playerId: string): Promise<Bid | undefined> {
    const bids = await this.getBidsForPlayer(roomId, playerId);
    return bids[0];
  }

  async addSkip(roomId: string, playerId: string, teamCode: TeamCode): Promise<Skip> {
    const id = randomUUID();
    const skip: Skip = {
      id,
      roomId,
      playerId,
      teamCode: teamCode,
      skippedAt: new Date(),
    };
    this.skips.set(id, skip);
    return skip;
  }

  async getSkips(roomId: string, playerId: string): Promise<Skip[]> {
    return Array.from(this.skips.values())
      .filter(skip => skip.roomId === roomId && skip.playerId === playerId);
  }

  async clearSkips(roomId: string, playerId: string): Promise<void> {
    const skipsToDelete = Array.from(this.skips.entries())
      .filter(([_, skip]) => skip.roomId === roomId && skip.playerId === playerId);
    
    skipsToDelete.forEach(([id, _]) => {
      this.skips.delete(id);
    });
  }

  async addSquadPlayer(roomId: string, teamCode: TeamCode, playerId: string, price: number): Promise<SquadPlayer> {
    const id = randomUUID();
    const squadPlayer: SquadPlayer = {
      id,
      roomId,
      teamCode: teamCode,
      playerId,
      price,
      purchasedAt: new Date(),
    };
    this.squadPlayers.set(id, squadPlayer);
    return squadPlayer;
  }

  async getSquadPlayers(roomId: string, teamCode?: TeamCode): Promise<SquadPlayer[]> {
    return Array.from(this.squadPlayers.values())
      .filter(squad => {
        if (squad.roomId !== roomId) return false;
        if (teamCode && squad.teamCode !== teamCode) return false;
        return true;
      })
      .sort((a, b) => a.purchasedAt.getTime() - a.purchasedAt.getTime());
  }
}

export const storage = new MemStorage();