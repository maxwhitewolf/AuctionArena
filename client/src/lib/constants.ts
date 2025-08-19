export const IPL_TEAMS = ['CSK', 'MI', 'RCB', 'KKR', 'SRH', 'RR', 'DC', 'PBKS', 'LSG', 'GT'] as const;

export const PLAYER_ROLES = ['Batsman', 'Bowler', 'All-Rounder', 'Wicket-Keeper'] as const;

export const STARTING_PURSE_L = 10000; // 100 Crore = 10,000 Lakhs
export const TEAM_MIN = 15;
export const TEAM_MAX = 20;
export const MAX_OVERSEAS = 8;

export const ROOM_STATUS = {
  LOBBY: 'lobby',
  TEAM_SELECTION: 'team_selection',
  LIVE: 'live',
  ENDED: 'ended'
} as const;
