import { useParams, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { TEAM_COLORS } from "@/lib/team-colors";
import { Timer } from "@/components/timer";
import { PlayerCard } from "@/components/player-card";
import { BidControls } from "@/components/bid-controls";
import { TeamCard } from "@/components/team-card";
import { useEffect } from "react";
import type { RoomWithMembers, AuctionState } from "@shared/schema";

export default function Auction() {
  const { code } = useParams();
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const userId = localStorage.getItem("userId");

  const { data: roomData, isLoading: roomLoading } = useQuery<RoomWithMembers>({
    queryKey: ["/api/rooms", code],
    refetchInterval: 2000,
  });

  const { data: auctionData, isLoading: auctionLoading } = useQuery<AuctionState>({
    queryKey: ["/api/rooms", code, "auction"],
    refetchInterval: 1000, // More frequent updates during auction
  });

  const placeBidMutation = useMutation({
    mutationFn: async (amount: number) => {
      const res = await apiRequest("POST", `/api/rooms/${code}/bid`, { userId, amount });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/rooms", code, "auction"] });
      toast({
        title: "Bid placed!",
        description: "Your bid has been placed successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Failed to place bid",
        description: error.message,
      });
    },
  });

  const skipMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", `/api/rooms/${code}/skip`, { userId });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/rooms", code, "auction"] });
      toast({
        title: "Skipped player",
        description: "You have skipped this player.",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Failed to skip",
        description: error.message,
      });
    },
  });

  const endBiddingMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", `/api/rooms/${code}/end-bidding`, { userId });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/rooms", code, "auction"] });
      toast({
        title: "Bidding ended",
        description: "You have ended bidding for your team.",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Failed to end bidding",
        description: error.message,
      });
    },
  });

  // Auto-finalize when timer expires
  useEffect(() => {
    if (auctionData?.room?.currentDeadlineAt) {
      const deadline = new Date(auctionData.room.currentDeadlineAt);
      const timeLeft = deadline.getTime() - Date.now();
      
      if (timeLeft <= 0) {
        // Timer expired, trigger finalize
        apiRequest("POST", `/api/rooms/${code}/finalize`, {})
          .then(() => {
            queryClient.invalidateQueries({ queryKey: ["/api/rooms", code, "auction"] });
          })
          .catch(console.error);
      }
    }
  }, [auctionData, code, queryClient]);

  // Auto-redirect based on room status
  useEffect(() => {
    if (roomData?.room) {
      const { room } = roomData;
      if (room.status === 'ended') {
        setLocation(`/r/${code}/summary`);
      }
    }
  }, [roomData, code, setLocation]);

  if (roomLoading || auctionLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto p-8">
          <Skeleton className="h-8 w-64 mb-8" />
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!roomData || !auctionData) return null;

  const { room: roomInfo } = roomData;
  const { room, currentPlayer, lastBid, bids, teams, nextMinBid } = auctionData;
  const userTeam = teams.find((t) => t.userId === userId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b-4 border-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center py-4">
            <div className="mb-4 lg:mb-0">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Live Auction</h1>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span>Room: <strong>{room.code}</strong></span>
                <span>•</span>
                <span>Teams: <strong>{teams.filter((t) => !t.hasEnded).length} Active</strong></span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {room.currentDeadlineAt && (
                <Timer deadline={new Date(room.currentDeadlineAt)} />
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Auction Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Player Card */}
            {currentPlayer && (
              <PlayerCard 
                player={currentPlayer}
                lastBid={lastBid}
                nextMinBid={nextMinBid}
              />
            )}

            {/* Bid Controls */}
            {currentPlayer && userTeam && (
              <BidControls
                nextMinBid={nextMinBid}
                userTeam={userTeam}
                currentPlayer={currentPlayer}
                onBid={(amount) => placeBidMutation.mutate(amount)}
                onSkip={() => skipMutation.mutate()}
                onEndBidding={() => endBiddingMutation.mutate()}
                isPlacingBid={placeBidMutation.isPending}
                isSkipping={skipMutation.isPending}
                isEndingBidding={endBiddingMutation.isPending}
              />
            )}

            {/* Bidding History */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Bidding History</h3>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {bids.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No bids yet</p>
                  ) : (
                    bids.map((bid, index) => {
                      const teamColor = TEAM_COLORS[bid.teamCode as keyof typeof TEAM_COLORS];
                      const timeAgo = Math.floor((Date.now() - new Date(bid.placedAt).getTime()) / 1000);
                      
                      return (
                        <div key={bid.id} className="flex items-center justify-between py-2 border-b border-gray-100">
                          <div className="flex items-center space-x-3">
                            <div 
                              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                              style={{ backgroundColor: teamColor.primary }}
                            >
                              {bid.teamCode}
                            </div>
                            <span className="font-medium">{teamColor.name}</span>
                          </div>
                          <div className="text-right">
                            <div className={`font-bold ${index === 0 ? 'text-green-600' : 'text-gray-600'}`}>
                              ₹{(bid.amount / 100).toFixed(1)} Cr
                            </div>
                            <div className="text-xs text-gray-500">
                              {timeAgo < 60 ? `${timeAgo}s ago` : `${Math.floor(timeAgo / 60)}m ago`}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Teams Sidebar */}
          <div className="space-y-6">
            {/* Team Status Cards */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Team Status</h3>
                <div className="space-y-4">
                  {teams.map((team) => (
                    <TeamCard
                      key={team.id}
                      team={team}
                      isUserTeam={team.userId === userId}
                      currentPlayer={currentPlayer}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Your Squad */}
            {userTeam && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Your Squad ({userTeam.totalCount}/20)
                  </h3>
                  <div className="space-y-3 max-h-80 overflow-y-auto">
                    {/* This would show squad players - simplified for now */}
                    <div className="text-center text-gray-500 py-4">
                      Squad details will be shown here
                    </div>
                  </div>
                  
                  {userTeam.totalCount >= 15 && !userTeam.hasEnded && (
                    <Button 
                      onClick={() => endBiddingMutation.mutate()}
                      disabled={endBiddingMutation.isPending}
                      className="w-full mt-4 bg-red-500 hover:bg-red-600"
                    >
                      {endBiddingMutation.isPending ? (
                        <>Ending...</>
                      ) : (
                        <>
                          <i className="fas fa-stop mr-2"></i>End My Bidding
                        </>
                      )}
                    </Button>
                  )}
                  
                  {userTeam.totalCount < 15 && (
                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-yellow-800 text-sm">
                        Need {15 - userTeam.totalCount} more players to end bidding
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}