import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TEAM_COLORS } from "@/lib/team-colors";
import type { Player, Bid } from "@shared/schema";
import { User, Star, TrendingUp } from "lucide-react";

interface PlayerCardProps {
  player: Player;
  lastBid?: Bid;
  nextMinBid?: number;
}

export function PlayerCard({ player, lastBid, nextMinBid }: PlayerCardProps) {
  return (
    <Card className="overflow-hidden bg-gradient-to-br from-gray-900/90 to-black/90 border-gray-700/50 shadow-2xl">
      <div className="relative bg-gradient-to-r from-amber-500 to-orange-600 p-8">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-2 right-2 w-8 h-8 border-2 border-white/30 rounded-full animate-pulse"></div>
          <div className="absolute bottom-2 left-2 w-6 h-6 border border-white/20 rounded-full animate-ping"></div>
        </div>
        
        <div className="relative flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-3xl font-bold text-black mb-3">{player.name}</h3>
            <div className="flex items-center space-x-3 flex-wrap gap-2">
              <Badge className="bg-black/20 text-black border-black/30 font-semibold">
                {player.role}
              </Badge>
              <Badge className="bg-black/20 text-black border-black/30 font-semibold">
                {player.nationality}
              </Badge>
              <Badge className="bg-white/90 text-black border-white/50 font-bold">
                Base: ₹{(player.basePrice / 100).toFixed(1)} Cr
              </Badge>
            </div>
          </div>
          <div className="relative">
            <div className="w-28 h-28 rounded-2xl overflow-hidden bg-black/20 border-2 border-white/30 shadow-xl">
              {player.imageUrl ? (
                <img src={player.imageUrl} alt={player.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User className="w-12 h-12 text-white/80" />
                </div>
              )}
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
              <Star className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>
      </div>
      
      <CardContent className="p-8">
        <div className="text-center mb-8">
          {lastBid ? (
            <div className="space-y-4">
              <div>
                <p className="text-gray-400 mb-2 text-sm font-medium">Current Highest Bid</p>
                <div className="text-5xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent mb-3 animate-pulse-slow">
                  ₹{(lastBid.amount / 100).toFixed(1)} Cr
                </div>
              </div>
              <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 inline-flex items-center px-6 py-3 rounded-full border border-gray-600/50">
                <div 
                  className="w-5 h-5 rounded-full mr-3 shadow-lg animate-pulse"
                  style={{ backgroundColor: TEAM_COLORS[lastBid.teamCode as keyof typeof TEAM_COLORS].primary }}
                ></div>
                <span className="text-white font-semibold">
                  {TEAM_COLORS[lastBid.teamCode as keyof typeof TEAM_COLORS].name}
                </span>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <p className="text-gray-400 mb-2 text-sm font-medium">Starting Price</p>
                <div className="text-5xl font-bold text-gray-500 mb-3">
                  ₹{(player.basePrice / 100).toFixed(1)} Cr
                </div>
              </div>
              <div className="bg-gray-800/50 inline-flex items-center px-6 py-3 rounded-full border border-gray-600/50">
                <TrendingUp className="w-4 h-4 text-amber-400 mr-2" />
                <span className="text-gray-400 font-medium">Waiting for first bid</span>
              </div>
            </div>
          )}
        </div>

        {/* Player Stats */}
        <div className="grid grid-cols-3 gap-6 pt-6 border-t border-gray-700/50">
          <div className="text-center group">
            <div className="text-2xl font-bold text-amber-400 group-hover:text-amber-300 transition-colors">★★★</div>
            <div className="text-xs text-gray-500 font-medium mt-1">Rating</div>
          </div>
          <div className="text-center group">
            <div className="text-2xl font-bold text-blue-400 group-hover:text-blue-300 transition-colors">IPL</div>
            <div className="text-xs text-gray-500 font-medium mt-1">Experience</div>
          </div>
          <div className="text-center group">
            <div className="text-2xl font-bold text-green-400 group-hover:text-green-300 transition-colors">A+</div>
            <div className="text-xs text-gray-500 font-medium mt-1">Form</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}