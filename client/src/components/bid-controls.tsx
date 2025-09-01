import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Gavel, X, StopCircle, Wallet, Users, Globe } from "lucide-react";

interface BidControlsProps {
  nextMinBid?: number;
  userTeam: any;
  currentPlayer: any;
  onBid: (amount: number) => void;
  onSkip: () => void;
  onEndBidding?: () => void;
  isPlacingBid: boolean;
  isSkipping: boolean;
  isEndingBidding?: boolean;
}

export function BidControls({ 
  nextMinBid, 
  userTeam, 
  currentPlayer, 
  onBid, 
  onSkip, 
  onEndBidding,
  isPlacingBid, 
  isSkipping,
  isEndingBidding = false
}: BidControlsProps) {
  if (!nextMinBid || userTeam.hasEnded) {
    return null;
  }

  // Check if team can afford the next bid
  const canAfford = userTeam.purseLeft >= nextMinBid;
  const teamFull = userTeam.totalCount >= 20;
  const overseasFull = currentPlayer.nationality !== 'India' && userTeam.overseasCount >= 5;
  const canEndBidding = userTeam.totalCount >= 15 && !userTeam.hasEnded && onEndBidding;
  
  const canBid = canAfford && !teamFull && !overseasFull && !userTeam.hasEnded;

  return (
    <Card className="bg-gradient-to-br from-gray-900/90 to-black/90 border-gray-700/50 shadow-2xl">
      <CardContent className="p-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
            <Gavel className="w-5 h-5 text-black" />
          </div>
          <h3 className="text-2xl font-bold text-white">Bidding Actions</h3>
        </div>
        
        {!canBid && (
          <div className="mb-6 p-4 bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-500/30 rounded-xl backdrop-blur-sm">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <p className="text-red-300 text-sm font-medium">
                {!canAfford && "Insufficient budget for next bid"}
                {teamFull && "Team is full (20 players)"}
                {overseasFull && "Overseas player limit reached (5 players)"}
                {userTeam.hasEnded && "You have ended bidding"}
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 mb-6">
          <Button 
            data-testid="button-place-bid"
            onClick={() => onBid(nextMinBid)}
            disabled={!canBid || isPlacingBid}
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-6 px-6 text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed button-glow shadow-lg hover:shadow-green-500/25 transition-all duration-300"
          >
            {isPlacingBid ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Bidding...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2">
                <Gavel className="w-5 h-5" />
                <span>Bid ₹{(nextMinBid / 100).toFixed(1)} Cr</span>
              </div>
            )}
          </Button>
          <Button 
            data-testid="button-skip-player"
            onClick={onSkip}
            disabled={isSkipping}
            variant="outline"
            className="py-6 px-6 font-semibold bg-gray-800/50 border-gray-600 hover:bg-gray-700/50 hover:border-gray-500 text-white hover:text-gray-200 transition-all duration-300"
          >
            {isSkipping ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-gray-400/30 border-t-gray-400 rounded-full animate-spin"></div>
                <span>Skipping...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2">
                <X className="w-5 h-5" />
                <span>Skip Player</span>
              </div>
            )}
          </Button>
        </div>

        {canEndBidding && (
          <div className="border-t border-gray-700/50 pt-6">
            <Button 
              data-testid="button-end-bidding"
              onClick={onEndBidding}
              disabled={isEndingBidding}
              className="w-full py-4 px-4 font-semibold bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white shadow-lg hover:shadow-red-500/25 transition-all duration-300"
            >
              {isEndingBidding ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Ending Bidding...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <StopCircle className="w-5 h-5" />
                  <span>End My Bidding</span>
                </div>
              )}
            </Button>
            <p className="text-xs text-gray-500 mt-2 text-center">
              You have {userTeam.totalCount} players (minimum 15 required)
            </p>
          </div>
        )}

        {/* Team Stats */}
        <div className="mt-6 grid grid-cols-3 gap-4 p-4 bg-gray-800/30 rounded-xl border border-gray-700/30">
          <div className="text-center group">
            <div className="flex items-center justify-center mb-2">
              <Wallet className="w-4 h-4 text-green-400 group-hover:text-green-300 transition-colors" />
            </div>
            <div className="text-lg font-bold text-green-400 group-hover:text-green-300 transition-colors">
              ₹{(userTeam.purseLeft / 100).toFixed(1)} Cr
            </div>
            <div className="text-xs text-gray-500 font-medium">Budget Left</div>
          </div>
          <div className="text-center group">
            <div className="flex items-center justify-center mb-2">
              <Users className="w-4 h-4 text-blue-400 group-hover:text-blue-300 transition-colors" />
            </div>
            <div className="text-lg font-bold text-blue-400 group-hover:text-blue-300 transition-colors">
              {userTeam.totalCount}/20
            </div>
            <div className="text-xs text-gray-500 font-medium">Players</div>
          </div>
          <div className="text-center group">
            <div className="flex items-center justify-center mb-2">
              <Globe className="w-4 h-4 text-purple-400 group-hover:text-purple-300 transition-colors" />
            </div>
            <div className="text-lg font-bold text-purple-400 group-hover:text-purple-300 transition-colors">
              {userTeam.overseasCount}/8
            </div>
            <div className="text-xs text-gray-500 font-medium">Overseas</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}