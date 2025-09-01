import { Badge } from "@/components/ui/badge";
import { TEAM_COLORS } from "@/lib/team-colors";
import type { RoomTeam, Player } from "@shared/schema";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials, stringToHslColor } from "@/lib/utils";
import { Crown, Wallet, Users, Globe } from "lucide-react";

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
    <div className={`relative border rounded-2xl p-6 bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm transition-all duration-300 hover:shadow-xl ${
      isUserTeam 
        ? 'border-2 border-amber-500/60 bg-gradient-to-br from-amber-500/10 to-orange-500/10 shadow-amber-500/20' 
        : 'border-gray-700/50 hover:border-gray-600/50'
    }`}>
      
      {/* Team header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold shadow-lg transition-transform group-hover:scale-110"
              style={{ backgroundColor: colors.primary, color: colors.text }}
            >
              {team.teamCode}
            </div>
            {isActive && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            )}
          </div>
          
          <Avatar className="border-2 border-gray-600">
            <AvatarFallback 
              style={{ background: stringToHslColor(team.username) }} 
              className="text-white font-semibold"
            >
              {getInitials(team.username)}
            </AvatarFallback>
          </Avatar>
          
          <div>
            <div className="flex items-center space-x-2">
              {isUserTeam && <Crown className="w-4 h-4 text-amber-400" />}
              <span className="font-semibold text-white">
                {isUserTeam ? 'Your Team' : team.username}
              </span>
            </div>
            <div className="text-xs text-gray-400 font-medium" style={{ color: colors.primary }}>
              {colors.name}
            </div>
          </div>
        </div>
        
        <Badge 
          variant={isActive ? 'default' : 'destructive'} 
          className={`text-xs font-semibold ${
            isActive 
              ? 'bg-green-500/20 text-green-300 border-green-500/30' 
              : team.hasEnded 
                ? 'bg-red-500/20 text-red-300 border-red-500/30'
                : 'bg-gray-500/20 text-gray-300 border-gray-500/30'
          }`}
        >
          {team.hasEnded ? 'Ended' : isActive ? 'Active' : 'Full'}
        </Badge>
      </div>
      
      {/* Team stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center group">
          <div className="flex items-center justify-center mb-2">
            <Wallet className="w-4 h-4 text-green-400 group-hover:text-green-300 transition-colors" />
          </div>
          <div className="text-sm font-semibold text-green-400 group-hover:text-green-300 transition-colors">
            ₹{(team.purseLeft / 100).toFixed(1)} Cr
          </div>
          <div className="text-xs text-gray-500 font-medium">Budget</div>
        </div>
        
        <div className="text-center group">
          <div className="flex items-center justify-center mb-2">
            <Users className="w-4 h-4 text-blue-400 group-hover:text-blue-300 transition-colors" />
          </div>
          <div className="text-sm font-semibold text-blue-400 group-hover:text-blue-300 transition-colors">
            {team.totalCount}/20
          </div>
          <div className="text-xs text-gray-500 font-medium">Players</div>
        </div>
        
        <div className="text-center group">
          <div className="flex items-center justify-center mb-2">
            <Globe className="w-4 h-4 text-purple-400 group-hover:text-purple-300 transition-colors" />
          </div>
          <div className="text-sm font-semibold text-purple-400 group-hover:text-purple-300 transition-colors">
            {team.overseasCount}/8
          </div>
          <div className="text-xs text-gray-500 font-medium">Overseas</div>
        </div>
      </div>

      {/* Active indicator for user team */}
      {isUserTeam && isActive && (
        <div className="absolute top-2 right-2">
          <div className="w-3 h-3 bg-amber-500 rounded-full animate-pulse shadow-lg"></div>
        </div>
      )}
    </div>
  );
}