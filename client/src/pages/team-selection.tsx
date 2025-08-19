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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-6xl mx-auto p-8">
          <Skeleton className="h-8 w-64 mb-8" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b-4 border-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-green-500 rounded-full flex items-center justify-center">
                <i className="fas fa-cricket-ball text-white text-lg"></i>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{room.name}</h1>
                <p className="text-sm text-gray-600">Team Selection</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Status Section */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Team Selection</h2>
                <p className="text-gray-600">Choose your IPL team to represent in the auction</p>
              </div>
              {currentTurnMember && (
                <div className="mt-4 md:mt-0">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium text-blue-800">
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
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Selection Order</h3>
              <div className="flex flex-wrap gap-3">
                {teamMembers.map((member) => {
                  const memberTeam = teams.find((t) => t.userId === member.userId);
                  const isCurrent = member.selectionOrder === teams.length + 1;
                  const hasSelected = !!memberTeam;
                  
                  return (
                    <div
                      key={member.id}
                      className={`flex items-center space-x-2 rounded-lg px-4 py-2 border-2 ${
                        hasSelected
                          ? 'bg-green-50 border-green-500'
                          : isCurrent
                          ? 'bg-blue-50 border-blue-500'
                          : 'bg-gray-50 border-gray-300'
                      }`}
                    >
                      <div className={`w-2 h-2 rounded-full ${
                        hasSelected
                          ? 'bg-green-500'
                          : isCurrent
                          ? 'bg-blue-500 animate-pulse'
                          : 'bg-gray-400'
                      }`}></div>
                      <span className={`text-sm font-medium ${
                        hasSelected
                          ? 'text-green-800'
                          : isCurrent
                          ? 'text-blue-800'
                          : 'text-gray-600'
                      }`}>
                        {member.selectionOrder}. {member.username}
                        {member.userId === userId && " (You)"}
                        {hasSelected && ` - ${memberTeam.teamCode} Selected`}
                        {isCurrent && !hasSelected && " - Selecting..."}
                      </span>
                      {hasSelected && (
                        <i className="fas fa-check text-green-600"></i>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* IPL Teams Grid */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Select Your IPL Team</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {IPL_TEAMS.map((teamCode) => {
                const isSelected = selectedTeams.includes(teamCode);
                const colors = TEAM_COLORS[teamCode as keyof typeof TEAM_COLORS];
                const selectedBy = teams.find((t) => t.teamCode === teamCode);
                const canSelect = !userTeam && isUserTurn && !isSelected;

                return (
                  <div
                    key={teamCode}
                    className={`relative rounded-xl p-4 text-center border-2 transition-all duration-200 ${
                      isSelected
                        ? 'opacity-75 border-green-500'
                        : canSelect
                        ? 'cursor-pointer hover:scale-105 border-transparent hover:border-white'
                        : 'opacity-50 cursor-not-allowed border-gray-300'
                    }`}
                    style={{ 
                      background: `linear-gradient(to bottom right, ${colors.primary}, ${colors.secondary})`,
                      color: colors.text
                    }}
                    onClick={() => canSelect && selectTeamMutation.mutate(teamCode)}
                  >
                    {isSelected && (
                      <div className="absolute top-2 right-2">
                        <i className="fas fa-check-circle text-green-600 text-xl"></i>
                      </div>
                    )}
                    <div className="mb-3">
                      <div 
                        className="w-16 h-16 rounded-full mx-auto flex items-center justify-center text-2xl font-bold"
                        style={{ backgroundColor: colors.primary, color: colors.text }}
                      >
                        {teamCode}
                      </div>
                    </div>
                    <h3 className="font-bold text-sm">{colors.name}</h3>
                    {isSelected && selectedBy && (
                      <p className="text-xs mt-1 opacity-80">
                        Selected by {selectedBy.username}
                      </p>
                    )}
                    {!isSelected && (
                      <p className="text-xs mt-1 opacity-80">Available</p>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Host Controls */}
        {isHost && (
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  {teams.length < teamMembers.length ? (
                    `Waiting for ${teamMembers.length - teams.length} more players to select teams...`
                  ) : (
                    "All players have selected their teams. Ready to start auction!"
                  )}
                </div>
                <div className="flex space-x-2">
                  <Button 
                    onClick={() => startAuctionMutation.mutate()}
                    disabled={teams.length < 2 || startAuctionMutation.isPending}
                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                  >
                    {startAuctionMutation.isPending ? (
                      <>Starting...</>
                    ) : (
                      <>
                        <i className="fas fa-play mr-2"></i>Start Auction
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}