import { Badge } from "@/components/ui/badge";
import { TEAM_COLORS } from "@/lib/team-colors";
import type { RoomTeam, Player } from "@shared/schema";

interface TeamCardProps {
  team: RoomTeam;
  isUserTeam: boolean;
  currentPlayer?: Player;
}

export function TeamCard({ team, isUserTeam, currentPlayer }: TeamCardProps) {
  const colors = TEAM_COLORS[team.teamCode as keyof typeof TEAM_COLORS];
  
  // Calculate if team is active for current player
  const isActive = !team.hasEnded && team.totalCount < 20;
  
  return (
    <div className={`border rounded-xl p-4 ${isUserTeam ? 'border-2 border-yellow-400 bg-yellow-50' : ''}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <div 
            className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
            style={{ backgroundColor: colors.primary, color: colors.text }}
          >
            {team.teamCode}
          </div>
          <span className="font-semibold text-gray-900">
            {isUserTeam ? 'Your Team' : team.username}
          </span>
        </div>
        <Badge variant={isActive ? 'default' : 'destructive'} className="text-xs">
          {team.hasEnded ? 'Ended' : isActive ? 'Active' : 'Full'}
        </Badge>
      </div>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <span className="text-gray-600">Budget:</span>
          <span className="font-semibold text-green-600 ml-1">
            ₹{(team.purseLeft / 100).toFixed(1)} Cr
          </span>
        </div>
        <div>
          <span className="text-gray-600">Players:</span>
          <span className="font-semibold ml-1">{team.totalCount}/20</span>
        </div>
        <div>
          <span className="text-gray-600">Overseas:</span>
          <span className="font-semibold ml-1">{team.overseasCount}/8</span>
        </div>
      </div>
    </div>
  );
}