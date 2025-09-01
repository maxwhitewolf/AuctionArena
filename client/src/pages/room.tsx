import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useEffect } from "react";
import type { RoomWithMembers } from "@shared/schema";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials, stringToHslColor } from "@/lib/utils";
import { Crown, Users, Share2, AlertTriangle, Info, Play, Clock } from "lucide-react";

export default function Room() {
  const { code } = useParams();
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const userId = localStorage.getItem("userId");

  const { data, isLoading, error } = useQuery<RoomWithMembers>({
    queryKey: ["/api/rooms", code],
    refetchInterval: 2000, // Poll every 2 seconds
  });

  const startTeamSelectionMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", `/api/rooms/${code}/start-team-selection`, { userId });
      return res.json();
    },
    onSuccess: () => {
      setLocation(`/r/${code}/teams`);
      toast({
        title: "Team selection started!",
        description: "Players can now select their IPL teams.",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Failed to start team selection",
        description: error.message,
      });
    },
  });

  // Auto-redirect based on room status
  useEffect(() => {
    if (data?.room) {
      const { room } = data;
      if (room.status === 'team_selection') {
        setLocation(`/r/${code}/teams`);
      } else if (room.status === 'live') {
        setLocation(`/r/${code}/auction`);
      } else if (room.status === 'ended') {
        setLocation(`/r/${code}/summary`);
      }
    }
  }, [data, code, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="max-w-4xl mx-auto p-8">
          <Skeleton className="h-8 w-64 mb-8 bg-gray-800/50" />
          <Skeleton className="h-32 w-full mb-6 bg-gray-800/50" />
          <div className="space-y-4">
            <Skeleton className="h-16 w-full bg-gray-800/50" />
            <Skeleton className="h-16 w-full bg-gray-800/50" />
            <Skeleton className="h-16 w-full bg-gray-800/50" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <Card className="w-full max-w-md bg-gradient-to-br from-gray-900/90 to-black/90 border-gray-700/50 shadow-2xl">
          <CardContent className="pt-8 pb-6 text-center">
            <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>
            <h2 className="text-xl font-bold text-white mb-3">Room Not Found</h2>
            <p className="text-gray-400 mb-6">The room code might be invalid or the room no longer exists.</p>
            <Button 
              onClick={() => setLocation("/")} 
              className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-black font-semibold"
            >
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { room, members, teams } = data;
  const isHost = room.hostUserId === userId;
  const teamMembers = members.filter((m) => m.role === 'team' || m.role === 'host');

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
                <h1 className="text-3xl font-bold text-white">{room.name}</h1>
                <p className="text-sm text-gray-400 font-medium">Room Code: <span className="text-amber-400 font-mono">{room.code}</span></p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge className={`text-xs font-semibold ${
                room.status === 'lobby' 
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' 
                  : 'bg-gray-500/20 text-gray-300 border-gray-500/30'
              }`}>
                {room.status === 'lobby' ? 'Waiting' : room.status}
              </Badge>
              {isHost && (
                <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                  <Crown className="w-3 h-3 mr-1" />
                  Host
                </Badge>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Room Info */}
        <Card className="mb-8 bg-gradient-to-br from-gray-900/90 to-black/90 border-gray-700/50 shadow-2xl">
          <CardContent className="p-8">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
              <div className="mb-6 lg:mb-0">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-white">Lobby</h2>
                </div>
                <p className="text-gray-400 mb-4 text-lg">Waiting for players to join the room.</p>
                <div className="flex items-center space-x-6 text-sm text-gray-400">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-blue-400" />
                    <span>Players: <strong className="text-blue-400">{teamMembers.length}/10</strong></span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-amber-400" />
                    <span>Status: <strong className="text-amber-400 capitalize">{room.status}</strong></span>
                  </div>
                </div>
              </div>
              {isHost && teamMembers.length >= 2 && teamMembers.length <= 10 && room.status === 'lobby' && (
                <Button 
                  data-testid="button-start-team-selection"
                  onClick={() => startTeamSelectionMutation.mutate()}
                  disabled={startTeamSelectionMutation.isPending}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 px-6 button-glow shadow-lg hover:shadow-green-500/25 transition-all duration-300"
                >
                  {startTeamSelectionMutation.isPending ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Starting...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Play className="w-5 h-5" />
                      <span>Start Team Selection</span>
                    </div>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Members List */}
        <Card className="bg-gradient-to-br from-gray-900/90 to-black/90 border-gray-700/50 shadow-2xl">
          <CardContent className="p-8">
            <h3 className="text-xl font-bold text-white mb-6">Players ({teamMembers.length}/10)</h3>
            <div className="space-y-4">
              {teamMembers.map((member, index) => (
                <div
                  key={member.id}
                  className={`flex items-center justify-between p-6 rounded-xl border transition-all duration-300 hover:scale-[1.02] ${
                    member.role === 'host' 
                      ? 'bg-purple-500/20 border-purple-500/30 shadow-purple-500/10' 
                      : 'bg-gray-800/30 border-gray-700/30 hover:bg-gray-800/50'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <Avatar className="border-2 border-gray-600">
                      <AvatarFallback style={{ background: stringToHslColor(member.username) }} className="text-white">
                        {getInitials(member.username)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold text-white text-lg">{member.username}</div>
                      <div className="text-sm text-gray-400 font-medium">
                        {member.role === 'host' ? 'Host' : member.role === 'spectator' ? 'Spectator' : 'Player'}
                      </div>
                    </div>
                    {member.role === 'host' && (
                      <Crown className="w-4 h-4 text-amber-400" />
                    )}
                  </div>
                  <div className="flex items-center space-x-3">
                    {member.userId === userId && (
                      <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30">You</Badge>
                    )}
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Status Messages */}
            {teamMembers.length < 2 && (
              <div className="mt-8 p-6 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-500/30 rounded-xl backdrop-blur-sm">
                <div className="flex items-center space-x-3">
                  <Info className="w-5 h-5 text-yellow-400" />
                  <span className="text-yellow-300 font-medium">Need at least 2 players to start the auction.</span>
                </div>
              </div>
            )}

            {teamMembers.length >= 10 && (
              <div className="mt-8 p-6 bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-500/30 rounded-xl backdrop-blur-sm">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                  <span className="text-red-300 font-medium">Room is full. Maximum 10 players allowed.</span>
                </div>
              </div>
            )}

            {/* Share Room */}
            <div className="mt-8 p-6 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-xl backdrop-blur-sm text-center">
              <div className="mb-4">
                <div className="w-16 h-16 bg-blue-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Share2 className="w-8 h-8 text-blue-400" />
                </div>
                <h4 className="text-blue-300 font-semibold text-lg mb-2">Invite Players to Join</h4>
                <p className="text-sm text-blue-400 mb-4">Share this room code with your friends</p>
                <div className="bg-black/30 px-6 py-3 rounded-xl border border-blue-500/30 inline-block">
                  <span className="text-2xl font-mono font-bold text-amber-400 tracking-widest">{room.code}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}