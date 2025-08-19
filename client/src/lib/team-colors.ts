export const TEAM_COLORS = {
  CSK: {
    primary: '#FBBF24', // Yellow
    secondary: '#F59E0B', // Amber
    text: '#92400E', // Dark amber for contrast
    name: 'Chennai Super Kings'
  },
  MI: {
    primary: '#3B82F6', // Blue
    secondary: '#1D4ED8', // Dark blue
    text: '#FFFFFF', // White
    name: 'Mumbai Indians'
  },
  RCB: {
    primary: '#EF4444', // Red
    secondary: '#DC2626', // Dark red
    text: '#FFFFFF', // White
    name: 'Royal Challengers Bangalore'
  },
  KKR: {
    primary: '#8B5CF6', // Purple
    secondary: '#7C3AED', // Dark purple
    text: '#FFFFFF', // White
    name: 'Kolkata Knight Riders'
  },
  SRH: {
    primary: '#F97316', // Orange
    secondary: '#EA580C', // Dark orange
    text: '#FFFFFF', // White
    name: 'Sunrisers Hyderabad'
  },
  RR: {
    primary: '#EC4899', // Pink
    secondary: '#DB2777', // Dark pink
    text: '#FFFFFF', // White
    name: 'Rajasthan Royals'
  },
  DC: {
    primary: '#2563EB', // Blue
    secondary: '#1D4ED8', // Dark blue
    text: '#FFFFFF', // White
    name: 'Delhi Capitals'
  },
  PBKS: {
    primary: '#DC2626', // Red
    secondary: '#B91C1C', // Dark red
    text: '#FFFFFF', // White
    name: 'Punjab Kings'
  },
  LSG: {
    primary: '#06B6D4', // Cyan
    secondary: '#0891B2', // Dark cyan
    text: '#FFFFFF', // White
    name: 'Lucknow Super Giants'
  },
  GT: {
    primary: '#3B82F6', // Blue
    secondary: '#2563EB', // Dark blue
    text: '#FFFFFF', // White
    name: 'Gujarat Titans'
  }
} as const;

export type TeamCode = keyof typeof TEAM_COLORS;
