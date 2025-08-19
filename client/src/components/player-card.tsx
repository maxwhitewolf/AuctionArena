import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TEAM_COLORS } from "@/lib/team-colors";
import type { Player, Bid } from "@shared/schema";

interface PlayerCardProps {
  player: Player;
  lastBid?: Bid;
  nextMinBid?: number;
}

export function PlayerCard({ player, lastBid, nextMinBid }: PlayerCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-blue-600 p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold mb-1">{player.name}</h3>
            <div className="flex items-center space-x-4">
              <Badge className="bg-white/20 text-white border-white/30">
                {player.role}
              </Badge>
              <Badge className="bg-white/20 text-white border-white/30">
                {player.nationality}
              </Badge>
              <Badge className="bg-white/20 text-white border-white/30">
                Base: ₹{(player.basePrice / 100).toFixed(1)} Cr
              </Badge>
            </div>
          </div>
          <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
            <i className="fas fa-user text-4xl"></i>
          </div>
        </div>
      </div>
      
      <CardContent className="p-6">
        <div className="text-center mb-6">
          {lastBid ? (
            <>
              <p className="text-gray-600 mb-2">Current Highest Bid</p>
              <div className="text-4xl font-bold text-green-600 mb-2">
                ₹{(lastBid.amount / 100).toFixed(1)} Cr
              </div>
              <div className="bg-blue-50 inline-flex items-center px-4 py-2 rounded-full">
                <div 
                  className="w-4 h-4 rounded-full mr-2"
                  style={{ backgroundColor: TEAM_COLORS[lastBid.teamCode as keyof typeof TEAM_COLORS].primary }}
                ></div>
                <span className="text-blue-800 font-medium">
                  {TEAM_COLORS[lastBid.teamCode as keyof typeof TEAM_COLORS].name}
                </span>
              </div>
            </>
          ) : (
            <>
              <p className="text-gray-600 mb-2">No Bids Yet</p>
              <div className="text-4xl font-bold text-gray-400 mb-2">
                ₹{(player.basePrice / 100).toFixed(1)} Cr
              </div>
              <div className="text-gray-600">Starting Price</div>
            </>
          )}
        </div>

        {/* Player Stats - Simplified */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">-</div>
            <div className="text-sm text-gray-600">Matches</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">-</div>
            <div className="text-sm text-gray-600">Performance</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">-</div>
            <div className="text-sm text-gray-600">Rating</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}