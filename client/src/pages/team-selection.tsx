import { useParams, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { IPL_TEAMS } from "@/lib/constants";
import { TEAM_COLORS } from "@/lib/team-colors";
import { useEffect } from "react";
import type { RoomWithMembers } from "@shared/schema";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials, stringToHslColor } from "@/lib/utils";
import { Crown, Users, Clock, Trophy, CheckCircle, Play } from "lucide-react";

export default function TeamSelection() {
  const { code } = useParams();
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const userId = localStorage.getItem("userId");

  const { data, isLoading } = useQuery<RoomWithMembers>({
    queryKey: ["/api/rooms", code],
    refetchInterval: 2000,
  });

  const selectTeamMutation = useMutation({
    mutationFn: async (teamCode: string) => {
      const res = await apiRequest("POST", `/api/rooms/${code}/select-team`, { userId, teamCode });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/rooms", code] });
      toast({
        title: "Team selected!",
        description: "Waiting for other players to select their teams.",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Failed to select team",
        description: error.message,
      });
    },
  });

  const startAuctionMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", `/api/rooms/${code}/start-auction`, { userId });
      return res.json();
    },
    onSuccess: () => {
      setLocation(`/r/${code}/auction`);
      toast({
        title: "Auction started!",
        description: "Let the bidding begin!",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Failed to start auction",
        description: error.message,
      });
    },
  });

  // Auto-redirect based on room status
  useEffect(() => {
    if (data?.room) {
      const { room } = data;
      if (room.status === 'live') {
        setLocation(`/r/${code}/auction`);
      } else if (room.status === 'ended') {
        setLocation(`/r/${code}/summary`);
      }
    }
  }, [data, code, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="max-w-6xl mx-auto p-8">
          <Skeleton className="h-8 w-64 mb-8 bg-gray-800/50" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <Skeleton key={i} className="h-32 w-full bg-gray-800/50" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const { room, members, teams } = data;
  const isHost = room.hostUserId === userId;
  const teamMembers = members.filter((m) => m.role === 'team' || m.role === 'host');
  const selectedTeams = teams.map((t) => t.teamCode);
  const userTeam = teams.find((t) => t.userId === userId);
  
  const currentTurnMember = teamMembers.find((m) => 
    m.selectionOrder === teams.length + 1
  );
  const isUserTurn = currentTurnMember?.userId === userId;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-float"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-gray-800/50 bg-black/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <Avatar className="border-2 border-gray-600">
                <AvatarFallback style={{ background: stringToHslColor(room.name) }} className="text-white">
                  {getInitials(room.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">{room.name}</h1>
                <p className="text-sm text-gray-400 font-medium">Team Selection Phase</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 bg-amber-500/20 px-4 py-2 rounded-full border border-amber-500/30">
              <Clock className="w-4 h-4 text-amber-400" />
              <span className="text-amber-300 text-sm font-medium">Selecting Teams</span>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Status Section */}
        <Card className="mb-8 bg-gradient-to-br from-gray-900/90 to-black/90 border-gray-700/50 shadow-2xl">
          <CardContent className="p-8">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
              <div className="mb-4 lg:mb-0">
                <h2 className="text-3xl font-bold text-white mb-2">Team Selection</h2>
                <p className="text-gray-400">Choose your IPL team to represent in the auction</p>
              </div>
              {currentTurnMember && (
                <div className="mt-4 lg:mt-0">
                  <div className="bg-blue-500/20 border border-blue-500/30 rounded-xl p-4 backdrop-blur-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium text-blue-300">
                        Current Turn: {currentTurnMember.username}
                        {isUserTurn && " (You)"}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Selection Order */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-white mb-4">Selection Order</h3>
              <div className="flex flex-wrap gap-3">
                {teamMembers.map((member) => {
                  const memberTeam = teams.find((t) => t.userId === member.userId);
                  const isCurrent = member.selectionOrder === teams.length + 1;
                  const hasSelected = !!memberTeam;
                  
                  return (
                    <div
                      key={member.id}
                      className={`flex items-center space-x-2 rounded-xl px-4 py-3 border-2 transition-all duration-300 ${
                        hasSelected
                          ? 'bg-green-500/20 border-green-500/60 shadow-green-500/20'
                          : isCurrent
                          ? 'bg-blue-500/20 border-blue-500/60 shadow-blue-500/20'
                          : 'bg-gray-800/30 border-gray-600/30'
                      }`}
                    >
                      <Avatar className="border border-gray-600">
                        <AvatarFallback style={{ background: stringToHslColor(member.username) }} className="text-white">
                          {getInitials(member.username)}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`w-2 h-2 rounded-full ${
                        hasSelected
                          ? 'bg-green-500'
                          : isCurrent
                          ? 'bg-blue-500 animate-pulse'
                          : 'bg-gray-500'
                      }`}></div>
                      <span className={`text-sm font-medium ${
                        hasSelected
                          ? 'text-green-300'
                          : isCurrent
                          ? 'text-blue-300'
                          : 'text-gray-400'
                      }`}>
                        {member.selectionOrder}. {member.username}
                        {member.userId === userId && " (You)"}
                        {hasSelected && ` - ${memberTeam.teamCode} Selected`}
                        {isCurrent && !hasSelected && " - Selecting..."}
                      </span>
                      {hasSelected && (
                        <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* IPL Teams Grid */}
        <Card className="mb-8 bg-gradient-to-br from-gray-900/90 to-black/90 border-gray-700/50 shadow-2xl">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold text-white mb-8 text-center">Select Your IPL Team</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {IPL_TEAMS.map((teamCode) => {
                const isSelected = selectedTeams.includes(teamCode);
                const colors = TEAM_COLORS[teamCode as keyof typeof TEAM_COLORS];
                const selectedBy = teams.find((t) => t.teamCode === teamCode);
                const canSelect = !userTeam && isUserTurn && !isSelected;

                return (
                  <div
                    key={teamCode}
                    data-testid={`team-card-${teamCode}`}
                    className={`relative rounded-2xl p-6 text-center border-2 transition-all duration-300 group ${
                      isSelected
                        ? 'opacity-75 border-green-500/60 shadow-green-500/20'
                        : canSelect
                        ? 'cursor-pointer hover:scale-105 border-transparent hover:border-amber-500/60 hover:shadow-xl card-hover'
                        : 'opacity-50 cursor-not-allowed border-gray-600/30'
                    }`}
                    style={{ 
                      background: `linear-gradient(to bottom right, ${colors.primary}, ${colors.secondary})`,
                      color: colors.text
                    }}
                    onClick={() => canSelect && selectTeamMutation.mutate(teamCode)}
                  >
                    {isSelected && (
                      <div className="absolute top-2 right-2">
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
                          <CheckCircle className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    )}
                    <div className="mb-4">
                      <div 
                        className="w-16 h-16 rounded-full mx-auto flex items-center justify-center text-2xl font-bold shadow-xl group-hover:shadow-2xl transition-shadow"
                        style={{ backgroundColor: colors.primary, color: colors.text }}
                      >
                        {teamCode}
                      </div>
                    </div>
                    <h3 className="font-bold text-sm mb-2">{colors.name}</h3>
                    {isSelected && selectedBy && (
                      <p className="text-xs opacity-80 font-medium bg-black/20 px-2 py-1 rounded-full">
                        Selected by {selectedBy.username}
                      </p>
                    )}
                    {!isSelected && canSelect && (
                      <p className="text-xs opacity-80 font-medium bg-green-500/20 px-2 py-1 rounded-full">
                        Click to select
                      </p>
                    )}
                    {!isSelected && !canSelect && (
                      <p className="text-xs opacity-60">Available</p>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Host Controls */}
        {isHost && (
          <Card className="bg-gradient-to-br from-gray-900/90 to-black/90 border-gray-700/50 shadow-2xl">
            <CardContent className="p-8">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
                <div className="mb-4 lg:mb-0">
                  <div className="flex items-center space-x-3 mb-2">
                    <Crown className="w-6 h-6 text-amber-400" />
                    <h3 className="text-xl font-bold text-white">Host Controls</h3>
                  </div>
                  <div className="text-sm text-gray-400">
                    {teams.length < teamMembers.length ? (
                      `Waiting for ${teamMembers.length - teams.length} more players to select teams...`
                    ) : (
                      "All players have selected their teams. Ready to start auction!"
                    )}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    data-testid="button-start-auction"
                    onClick={() => startAuctionMutation.mutate()}
                    disabled={teams.length < 2 || startAuctionMutation.isPending}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 px-6 button-glow shadow-lg hover:shadow-green-500/25 transition-all duration-300"
                  >
                    {startAuctionMutation.isPending ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Starting...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Play className="w-5 h-5" />
                        <span>Start Auction</span>
                      </div>
                    )}
                  </Button>
                </div>
              </div>
              
              {teams.length < 2 && (
                <div className="mt-6 p-4 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-500/30 rounded-xl backdrop-blur-sm">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-yellow-400" />
                    <span className="text-yellow-300 text-sm font-medium">
                      Need at least 2 teams to start the auction.
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}