import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Room statuses
export const ROOM_STATUS = {
  LOBBY: 'lobby',
  TEAM_SELECTION: 'team_selection', 
  LIVE: 'live',
  ENDED: 'ended'
} as const;

export type RoomStatus = typeof ROOM_STATUS[keyof typeof ROOM_STATUS];

// IPL Teams
export const IPL_TEAMS = ['CSK', 'MI', 'RCB', 'KKR', 'SRH', 'RR', 'DC', 'PBKS', 'LSG', 'GT'] as const;
export type TeamCode = typeof IPL_TEAMS[number];

// Player roles
export const PLAYER_ROLES = ['Batsman', 'Bowler', 'All-Rounder', 'Wicket-Keeper'] as const;
export type PlayerRole = typeof PLAYER_ROLES[number];

// Constants
export const STARTING_PURSE_L = 10000; // 100 Crore = 10,000 Lakhs
export const TEAM_MIN = 15;
export const TEAM_MAX = 20;
export const MAX_OVERSEAS = 8;

// Rooms table
export const rooms = pgTable("rooms", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  code: varchar("code", { length: 6 }).notNull().unique(),
  name: text("name").notNull(),
  status: text("status").notNull().default(ROOM_STATUS.LOBBY),
  hostUserId: varchar("host_user_id").notNull(),
  currentPlayerId: varchar("current_player_id"),
  currentDeadlineAt: timestamp("current_deadline_at"),
  countdownSeconds: integer("countdown_seconds").notNull().default(30),
  version: integer("version").notNull().default(0),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

// Room members
export const roomMembers = pgTable("room_members", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  roomId: varchar("room_id").notNull(),
  userId: varchar("user_id").notNull(),
  username: text("username").notNull(),
  role: varchar("role").notNull().default('team'), // 'host', 'team'
  joinedAt: timestamp("joined_at").notNull().default(sql`now()`),
  selectionOrder: integer("selection_order"),
  hasEnded: boolean("has_ended").notNull().default(false),
});

// Room teams (selected IPL teams)
export const roomTeams = pgTable("room_teams", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  roomId: varchar("room_id").notNull(),
  teamCode: text("team_code").notNull(),
  userId: varchar("user_id").notNull(),
  username: text("username").notNull(),
  selectionOrder: integer("selection_order").notNull(),
  purseLeft: integer("purse_left").notNull().default(STARTING_PURSE_L),
  totalCount: integer("total_count").notNull().default(0),
  overseasCount: integer("overseas_count").notNull().default(0),
  hasEnded: boolean("has_ended").notNull().default(false),
});

// Players database
export const players = pgTable("players", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  role: text("role").notNull(),
  nationality: text("nationality").notNull(),
  basePrice: integer("base_price").notNull(), // in Lakhs
  stats: jsonb("stats"), // flexible stats object
});

// Player queue for auction
export const playerQueue = pgTable("player_queue", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  roomId: varchar("room_id").notNull(),
  playerId: varchar("player_id").notNull(),
  queueOrder: integer("queue_order").notNull(),
  status: varchar("status").notNull().default('queued'), // 'queued', 'auctioning', 'sold', 'unsold'
  isAuctioning: boolean("is_auctioning").notNull().default(false),
});

// Bids
export const bids = pgTable("bids", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  roomId: varchar("room_id").notNull(),
  playerId: varchar("player_id").notNull(),
  teamCode: text("team_code").notNull(),
  amount: integer("amount").notNull(), // in Lakhs
  placedAt: timestamp("placed_at").notNull().default(sql`now()`),
});

// Skips
export const skips = pgTable("skips", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  roomId: varchar("room_id").notNull(),
  playerId: varchar("player_id").notNull(),
  teamCode: text("team_code").notNull(),
  skippedAt: timestamp("skipped_at").notNull().default(sql`now()`),
});

// Squad players (final teams)
export const squadPlayers = pgTable("squad_players", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  roomId: varchar("room_id").notNull(),
  teamCode: text("team_code").notNull(),
  playerId: varchar("player_id").notNull(),
  price: integer("price").notNull(), // final winning bid in Lakhs
  purchasedAt: timestamp("purchased_at").notNull().default(sql`now()`),
});

// Insert schemas
export const insertRoomSchema = createInsertSchema(rooms).omit({
  id: true,
  createdAt: true,
  version: true,
  code: true,
});

export const insertRoomMemberSchema = createInsertSchema(roomMembers).omit({
  id: true,
  joinedAt: true,
});

export const insertRoomTeamSchema = createInsertSchema(roomTeams).omit({
  id: true,
});

export const insertPlayerSchema = createInsertSchema(players).omit({
  id: true,
});

export const insertBidSchema = createInsertSchema(bids).omit({
  id: true,
  placedAt: true,
});

// Types
export type InsertRoom = z.infer<typeof insertRoomSchema>;
export type Room = typeof rooms.$inferSelect;

export type InsertRoomMember = z.infer<typeof insertRoomMemberSchema>;
export type RoomMember = typeof roomMembers.$inferSelect;

export type InsertRoomTeam = z.infer<typeof insertRoomTeamSchema>;
export type RoomTeam = typeof roomTeams.$inferSelect;

export type InsertPlayer = z.infer<typeof insertPlayerSchema>;
export type Player = typeof players.$inferSelect;

export type InsertBid = z.infer<typeof insertBidSchema>;
export type Bid = typeof bids.$inferSelect;

export type Skip = typeof skips.$inferSelect;
export type SquadPlayer = typeof squadPlayers.$inferSelect;
export type PlayerQueue = typeof playerQueue.$inferSelect;

// API response types
export type RoomWithMembers = Room & {
  members: RoomMember[];
  teams: RoomTeam[];
  currentPlayer?: Player;
};

export type AuctionState = {
  room: Room;
  currentPlayer?: Player;
  lastBid?: Bid;
  bids: Bid[];
  teams: RoomTeam[];
  skips: Skip[];
  isActive: boolean;
  nextMinBid?: number;
};

export type TeamSummary = RoomTeam & {
  players: (SquadPlayer & { player: Player })[];
};

// Helper function for minimum increments
export function getMinIncrement(amount: number): number {
  if (amount < 5000) return 500; // 5L increment below 50Cr  
  if (amount < 10000) return 1000; // 10L increment 50Cr-100Cr
  if (amount < 50000) return 2500; // 25L increment 100Cr-500Cr
  if (amount < 100000) return 5000; // 50L increment 500Cr-1000Cr
  return 10000; // 100L increment above 1000Cr
}

// Expected next amount calculation
export function expectedNextAmount(lastBid: Bid | null | undefined, basePrice: number): number {
  if (!lastBid) {
    return Math.max(basePrice, getMinIncrement(basePrice));
  }
  return lastBid.amount + getMinIncrement(lastBid.amount);
}

// Check if team is active for current player
export function isTeamActive(team: RoomTeam, currentPlayer: Player, lastBid: Bid | null | undefined): boolean {
  if (team.hasEnded || team.totalCount >= TEAM_MAX) {
    return false;
  }
  
  const nextMinBid = expectedNextAmount(lastBid, currentPlayer.basePrice);
  return team.purseLeft >= nextMinBid;
}