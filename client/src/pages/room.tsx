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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-4xl mx-auto p-8">
          <Skeleton className="h-8 w-64 mb-8" />
          <Skeleton className="h-32 w-full mb-6" />
          <div className="space-y-4">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <i className="fas fa-exclamation-triangle text-red-500 text-4xl mb-4"></i>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Room Not Found</h2>
              <p className="text-gray-600 mb-4">The room code might be invalid or the room no longer exists.</p>
              <Button onClick={() => setLocation("/")} className="w-full">
                Back to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { room, members, teams } = data;
  const isHost = room.hostUserId === userId;
  const teamMembers = members.filter((m) => m.role === 'team' || m.role === 'host');

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
                <p className="text-sm text-gray-600">Room Code: {room.code}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant={room.status === 'lobby' ? 'default' : 'secondary'}>
                {room.status === 'lobby' ? 'Waiting' : room.status}
              </Badge>
              {isHost && (
                <Badge variant="outline">Host</Badge>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Room Info */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Lobby</h2>
                <p className="text-gray-600 mb-4">Waiting for players to join the room.</p>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span>Players: <strong>{teamMembers.length}/10</strong></span>
                  <span>•</span>
                  <span>Status: <strong className="capitalize">{room.status}</strong></span>
                </div>
              </div>
              {isHost && teamMembers.length >= 2 && teamMembers.length <= 10 && room.status === 'lobby' && (
                <Button 
                  onClick={() => startTeamSelectionMutation.mutate()}
                  disabled={startTeamSelectionMutation.isPending}
                  className="mt-4 md:mt-0 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                >
                  {startTeamSelectionMutation.isPending ? (
                    <>Starting...</>
                  ) : (
                    <>
                      <i className="fas fa-play mr-2"></i>Start Team Selection
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Members List */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Players ({teamMembers.length}/10)</h3>
            <div className="space-y-3">
              {teamMembers.map((member, index) => (
                <div
                  key={member.id}
                  className={`flex items-center justify-between p-4 rounded-lg border ${
                    member.role === 'host' ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                      member.role === 'host' ? 'bg-blue-500' : 'bg-gray-500'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{member.username}</div>
                      <div className="text-sm text-gray-600">
                        {member.role === 'host' ? 'Host' : 'Player'}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {member.userId === userId && (
                      <Badge variant="outline">You</Badge>
                    )}
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                </div>
              ))}
            </div>

            {teamMembers.length < 2 && (
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center">
                  <i className="fas fa-info-circle text-yellow-600 mr-2"></i>
                  <span className="text-yellow-800">Need at least 2 players to start the auction.</span>
                </div>
              </div>
            )}

            {teamMembers.length >= 10 && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center">
                  <i className="fas fa-exclamation-triangle text-red-600 mr-2"></i>
                  <span className="text-red-800">Room is full. Maximum 10 players allowed.</span>
                </div>
              </div>
            )}

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="text-center">
                <i className="fas fa-share-alt text-blue-600 text-2xl mb-2"></i>
                <p className="text-blue-800 font-medium mb-2">Invite players to join</p>
                <p className="text-sm text-blue-600">Share room code: <strong className="text-lg font-mono">{room.code}</strong></p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}