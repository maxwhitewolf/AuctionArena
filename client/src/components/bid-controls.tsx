import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

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
    <Card>
      <CardContent className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Bidding Actions</h3>
        
        {!canBid && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm">
              {!canAfford && "Insufficient budget for next bid"}
              {teamFull && "Team is full (20 players)"}
              {overseasFull && "Overseas player limit reached (5 players)"}
              {userTeam.hasEnded && "You have ended bidding"}
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <Button 
            onClick={() => onBid(nextMinBid)}
            disabled={!canBid || isPlacingBid}
            className="bg-gradient-to-r from-green-500 to-green-600 text-white py-4 px-6 text-lg font-bold hover:from-green-600 hover:to-green-700"
          >
            {isPlacingBid ? (
              <>Bidding...</>
            ) : (
              <>
                <i className="fas fa-gavel mr-2"></i>
                Bid ₹{(nextMinBid / 100).toFixed(1)} Cr
              </>
            )}
          </Button>
          <Button 
            onClick={onSkip}
            disabled={isSkipping}
            variant="outline"
            className="py-4 px-6 font-semibold"
          >
            {isSkipping ? (
              <>Skipping...</>
            ) : (
              <>
                <i className="fas fa-times mr-2"></i>
                Skip
              </>
            )}
          </Button>
        </div>

        {canEndBidding && (
          <div className="mt-4">
            <Button 
              onClick={onEndBidding}
              disabled={isEndingBidding}
              variant="destructive"
              className="w-full py-2 px-4 text-sm font-semibold"
            >
              {isEndingBidding ? (
                <>Ending Bidding...</>
              ) : (
                <>
                  <i className="fas fa-stop mr-2"></i>
                  End My Bidding
                </>
              )}
            </Button>
            <p className="text-xs text-gray-500 mt-1 text-center">
              You have {userTeam.totalCount} players (minimum 15 required)
            </p>
          </div>
        )}

        <div className="mt-4 text-sm text-gray-600">
          <p>Your Budget: ₹{(userTeam.purseLeft / 100).toFixed(1)} Cr</p>
          <p>Players: {userTeam.totalCount}/20</p>
          {currentPlayer.nationality !== 'India' && (
            <p>Overseas: {userTeam.overseasCount}/5</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
