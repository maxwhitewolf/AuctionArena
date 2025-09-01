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
import { Trophy, Clock, Users, TrendingUp, Activity, DollarSign } from "lucide-react";

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
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="max-w-7xl mx-auto p-8">
          <div className="mb-8">
            <Skeleton className="h-12 w-96 bg-gray-800/50" />
            <Skeleton className="h-6 w-64 bg-gray-800/50 mt-4" />
          </div>
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-80 w-full bg-gray-800/50" />
              <Skeleton className="h-48 w-full bg-gray-800/50" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-96 w-full bg-gray-800/50" />
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
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/3 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-500/3 rounded-full blur-3xl animate-float"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-gray-800/50 bg-black/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center py-6">
            <div className="mb-4 lg:mb-0">
              <div className="flex items-center space-x-4 mb-2">
                <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center">
                  <Activity className="w-4 h-4 text-white" />
                </div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-red-400 to-pink-500 bg-clip-text text-transparent">
                  🔴 LIVE AUCTION
                </h1>
              </div>
              <div className="flex items-center space-x-6 text-sm text-gray-400">
                <div className="flex items-center space-x-2">
                  <Trophy className="w-4 h-4 text-amber-400" />
                  <span>Room: <strong className="text-white">{room.code}</strong></span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-blue-400" />
                  <span>Active Teams: <strong className="text-white">{teams.filter((t) => !t.hasEnded).length}</strong></span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {room.currentDeadlineAt && (
                <div className="bg-gray-800/50 px-4 py-2 rounded-xl border border-gray-700/50 backdrop-blur-sm">
                  <Timer deadline={new Date(room.currentDeadlineAt)} />
                </div>
              )}
              <div className="flex items-center space-x-2 bg-red-500/20 px-4 py-2 rounded-xl border border-red-500/30">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-red-300 text-sm font-medium">LIVE</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Auction Section */}
          <div className="lg:col-span-2 space-y-8">
            {/* Current Player Card */}
            {currentPlayer && (
              <div className="animate-fade-in">
                <PlayerCard 
                  player={currentPlayer}
                  lastBid={lastBid}
                  nextMinBid={nextMinBid}
                />
              </div>
            )}

            {/* Bid Controls */}
            {currentPlayer && userTeam && (
              <div className="animate-fade-in">
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
              </div>
            )}

            {/* Bidding History */}
            <Card className="bg-gradient-to-br from-gray-900/90 to-black/90 border-gray-700/50 shadow-2xl">
              <CardContent className="p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Bidding History</h3>
                </div>
                
                <div className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar">
                  {bids.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-800/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <DollarSign className="w-8 h-8 text-gray-600" />
                      </div>
                      <p className="text-gray-500 text-lg">No bids placed yet</p>
                      <p className="text-gray-600 text-sm mt-2">Be the first to start the bidding!</p>
                    </div>
                  ) : (
                    bids.map((bid, index) => {
                      const teamColor = TEAM_COLORS[bid.teamCode as keyof typeof TEAM_COLORS];
                      const timeAgo = Math.floor((Date.now() - new Date(bid.placedAt).getTime()) / 1000);
                      
                      return (
                        <div 
                          key={bid.id} 
                          className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-300 hover:scale-[1.02] ${
                            index === 0 
                              ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/30 shadow-lg' 
                              : 'bg-gray-800/30 border-gray-700/30 hover:bg-gray-800/50'
                          }`}
                        >
                          <div className="flex items-center space-x-4">
                            <div className="relative">
                              <div 
                                className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-lg"
                                style={{ backgroundColor: teamColor.primary }}
                              >
                                {bid.teamCode}
                              </div>
                              {index === 0 && (
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse">
                                  <div className="w-2 h-2 bg-white rounded-full mx-auto mt-1"></div>
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="font-semibold text-white text-lg">{teamColor.name}</div>
                              <div className="text-xs text-gray-400">
                                {timeAgo < 60 ? `${timeAgo}s ago` : `${Math.floor(timeAgo / 60)}m ago`}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`text-2xl font-bold ${
                              index === 0 ? 'text-green-400' : 'text-gray-400'
                            }`}>
                              ₹{(bid.amount / 100).toFixed(1)} Cr
                            </div>
                            {index === 0 && (
                              <Badge className="bg-green-500/20 text-green-300 border-green-500/30 text-xs">
                                Leading
                              </Badge>
                            )}
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
          <div className="space-y-8">
            {/* Team Status Cards */}
            <Card className="bg-gradient-to-br from-gray-900/90 to-black/90 border-gray-700/50 shadow-2xl">
              <CardContent className="p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
                    <Users className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Teams</h3>
                </div>
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

            {/* Your Squad Summary */}
            {userTeam && (
              <Card className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/30 shadow-2xl">
                <CardContent className="p-8">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
                      <Trophy className="w-4 h-4 text-black" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">
                      Your Squad ({userTeam.totalCount}/20)
                    </h3>
                  </div>
                  
                  {/* Squad Summary Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-800/30 p-4 rounded-xl border border-gray-700/30 text-center">
                      <div className="text-2xl font-bold text-green-400 mb-1">
                        ₹{(userTeam.purseLeft / 100).toFixed(1)} Cr
                      </div>
                      <div className="text-xs text-gray-400 font-medium">Remaining Budget</div>
                    </div>
                    <div className="bg-gray-800/30 p-4 rounded-xl border border-gray-700/30 text-center">
                      <div className="text-2xl font-bold text-blue-400 mb-1">
                        {userTeam.overseasCount}/8
                      </div>
                      <div className="text-xs text-gray-400 font-medium">Overseas Players</div>
                    </div>
                  </div>

                  {/* Squad progress bar */}
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-400 font-medium">Squad Progress</span>
                      <span className="text-sm text-amber-400 font-semibold">{userTeam.totalCount}/20</span>
                    </div>
                    <div className="w-full bg-gray-800/50 rounded-full h-3 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-amber-500 to-orange-600 h-full rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${(userTeam.totalCount / 20) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  {userTeam.totalCount >= 15 && !userTeam.hasEnded && (
                    <Button 
                      data-testid="button-end-team-bidding"
                      onClick={() => endBiddingMutation.mutate()}
                      disabled={endBiddingMutation.isPending}
                      className="w-full bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white py-3 font-semibold shadow-lg hover:shadow-red-500/25 transition-all duration-300"
                    >
                      {endBiddingMutation.isPending ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>Ending...</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center space-x-2">
                          <Activity className="w-5 h-5" />
                          <span>End My Bidding</span>
                        </div>
                      )}
                    </Button>
                  )}
                  
                  {userTeam.totalCount < 15 && (
                    <div className="p-4 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-500/30 rounded-xl backdrop-blur-sm">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-yellow-400" />
                        <p className="text-yellow-300 text-sm font-medium">
                          Need {15 - userTeam.totalCount} more players to end bidding
                        </p>
                      </div>
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