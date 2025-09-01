import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";
import { Trophy, Users, Clock, Target, Plus, DoorOpen, Sparkles } from "lucide-react";

export default function Home() {
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  const [createForm, setCreateForm] = useState({ roomName: "", username: "" });
  const [joinForm, setJoinForm] = useState({ roomCode: "", username: "" });

  const createRoomMutation = useMutation({
    mutationFn: async (data: { roomName: string; username: string }) => {
      const res = await apiRequest("POST", "/api/rooms", data);
      return res.json();
    },
    onSuccess: (data) => {
      localStorage.setItem("userId", data.userId);
      localStorage.setItem("username", data.member.username);
      setLocation(`/r/${data.room.code}`);
      toast({
        title: "Room created successfully!",
        description: `Room code: ${data.room.code}`,
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Failed to create room",
        description: error.message,
      });
    },
  });

  const joinRoomMutation = useMutation({
    mutationFn: async (data: { roomCode: string; username: string }) => {
      const res = await apiRequest("POST", "/api/rooms/join", data);
      return res.json();
    },
    onSuccess: (data) => {
      localStorage.setItem("userId", data.userId);
      localStorage.setItem("username", data.member.username);
      setLocation(`/r/${data.room.code}`);
      toast({
        title: "Joined room successfully!",
        description: `Welcome to ${data.room.name}`,
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Failed to join room",
        description: error.message,
      });
    },
  });

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!createForm.roomName.trim() || !createForm.username.trim()) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please fill in both room name and username",
      });
      return;
    }
    createRoomMutation.mutate(createForm);
  };

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinForm.roomCode.trim() || !joinForm.username.trim()) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please fill in both room code and username",
      });
      return;
    }
    joinRoomMutation.mutate(joinForm);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-yellow-500/3 rounded-full blur-2xl animate-pulse-slow"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-gray-800/50 bg-black/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-xl">
                  <Trophy className="w-6 h-6 text-black" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                  IPL Auction Pro
                </h1>
                <p className="text-gray-400 text-sm font-medium">Premium Cricket Auction Experience</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-2 bg-gray-800/50 px-4 py-2 rounded-full border border-gray-700">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-400 text-sm font-medium">Live</span>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center py-16 mb-16">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-yellow-500/20 rounded-3xl blur-xl"></div>
            <div className="relative bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-xl rounded-3xl p-12 border border-gray-800/50">
              <div className="mb-8">
                <h2 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-amber-400 via-orange-500 to-yellow-400 bg-clip-text text-transparent animate-pulse-slow">
                  IPL Auction 2025
                </h2>
                <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                  Experience the thrill of building your dream cricket team in the most sophisticated auction simulator
                </p>
              </div>
              
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 backdrop-blur-sm px-6 py-3 rounded-full border border-amber-500/30 group hover:border-amber-500/60 transition-colors">
                  <span className="text-amber-300 font-semibold group-hover:text-amber-200 transition-colors">₹100 Crore Budget</span>
                </div>
                <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm px-6 py-3 rounded-full border border-blue-500/30 group hover:border-blue-500/60 transition-colors">
                  <span className="text-blue-300 font-semibold group-hover:text-blue-200 transition-colors">10 IPL Teams</span>
                </div>
                <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-sm px-6 py-3 rounded-full border border-green-500/30 group hover:border-green-500/60 transition-colors">
                  <span className="text-green-300 font-semibold group-hover:text-green-200 transition-colors">Real-Time Bidding</span>
                </div>
              </div>
              
              <div className="animate-float">
                <Sparkles className="w-8 h-8 text-amber-400 mx-auto" />
              </div>
            </div>
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Create Room Card */}
          <div className="gradient-border card-hover">
            <Card className="bg-gradient-to-br from-gray-900/90 to-black/90 border-0 shadow-2xl">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <div className="relative mx-auto mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-xl group-hover:shadow-green-500/25 transition-shadow">
                      <Plus className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center">
                      <Sparkles className="w-3 h-3 text-black" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">Create Auction</h3>
                  <p className="text-gray-400 leading-relaxed">Launch a new auction room and invite friends to compete</p>
                </div>
                
                <form onSubmit={handleCreateRoom} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="roomName" className="text-gray-300 font-medium">Room Name</Label>
                    <Input
                      id="roomName"
                      data-testid="input-room-name"
                      placeholder="Enter a creative room name"
                      value={createForm.roomName}
                      onChange={(e) => setCreateForm({ ...createForm, roomName: e.target.value })}
                      className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-amber-500 focus:ring-amber-500/20 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-gray-300 font-medium">Your Name</Label>
                    <Input
                      id="username"
                      data-testid="input-username-create"
                      placeholder="Enter your display name"
                      value={createForm.username}
                      onChange={(e) => setCreateForm({ ...createForm, username: e.target.value })}
                      className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-amber-500 focus:ring-amber-500/20 transition-all"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    data-testid="button-create-room"
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 button-glow shadow-lg hover:shadow-green-500/25 transition-all duration-300"
                    disabled={createRoomMutation.isPending}
                  >
                    {createRoomMutation.isPending ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Creating...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center space-x-2">
                        <Plus className="w-5 h-5" />
                        <span>Create Auction Room</span>
                      </div>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Join Room Card */}
          <div className="gradient-border card-hover">
            <Card className="bg-gradient-to-br from-gray-900/90 to-black/90 border-0 shadow-2xl">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <div className="relative mx-auto mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl group-hover:shadow-blue-500/25 transition-shadow">
                      <DoorOpen className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center">
                      <Target className="w-3 h-3 text-black" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">Join Auction</h3>
                  <p className="text-gray-400 leading-relaxed">Enter a room code to join an existing auction battle</p>
                </div>
                
                <form onSubmit={handleJoinRoom} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="roomCode" className="text-gray-300 font-medium">Room Code</Label>
                    <Input
                      id="roomCode"
                      data-testid="input-room-code"
                      placeholder="Enter 6-digit code"
                      maxLength={6}
                      value={joinForm.roomCode}
                      onChange={(e) => setJoinForm({ ...joinForm, roomCode: e.target.value.toUpperCase() })}
                      className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-amber-500 focus:ring-amber-500/20 transition-all text-center text-2xl font-mono tracking-widest"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="joinUsername" className="text-gray-300 font-medium">Your Name</Label>
                    <Input
                      id="joinUsername"
                      data-testid="input-username-join"
                      placeholder="Enter your display name"
                      value={joinForm.username}
                      onChange={(e) => setJoinForm({ ...joinForm, username: e.target.value })}
                      className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-amber-500 focus:ring-amber-500/20 transition-all"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    data-testid="button-join-room"
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 button-glow shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
                    disabled={joinRoomMutation.isPending}
                  >
                    {joinRoomMutation.isPending ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Joining...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center space-x-2">
                        <DoorOpen className="w-5 h-5" />
                        <span>Join Auction Room</span>
                      </div>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-20">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-4">
              Premium Auction Features
            </h3>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Experience professional-grade auction mechanics with real-time updates and strategic gameplay
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="group">
              <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 border-gray-700/50 hover:border-amber-500/50 transition-all duration-300 card-hover backdrop-blur-sm">
                <CardContent className="p-8 text-center">
                  <div className="relative mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto shadow-xl group-hover:shadow-amber-500/25 transition-shadow">
                      <Users className="w-8 h-8 text-black" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                  <h4 className="text-xl font-bold text-white mb-3 group-hover:text-amber-300 transition-colors">Team Strategy</h4>
                  <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">
                    Strategic team selection from 10 authentic IPL franchises with budget management
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="group">
              <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 border-gray-700/50 hover:border-amber-500/50 transition-all duration-300 card-hover backdrop-blur-sm">
                <CardContent className="p-8 text-center">
                  <div className="relative mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto shadow-xl group-hover:shadow-red-500/25 transition-shadow">
                      <Clock className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full animate-pulse"></div>
                  </div>
                  <h4 className="text-xl font-bold text-white mb-3 group-hover:text-amber-300 transition-colors">Live Bidding</h4>
                  <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">
                    Real-time auction mechanics with countdown timers and instant bid updates
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="group">
              <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 border-gray-700/50 hover:border-amber-500/50 transition-all duration-300 card-hover backdrop-blur-sm">
                <CardContent className="p-8 text-center">
                  <div className="relative mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto shadow-xl group-hover:shadow-purple-500/25 transition-shadow">
                      <Target className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-500 rounded-full animate-pulse"></div>
                  </div>
                  <h4 className="text-xl font-bold text-white mb-3 group-hover:text-amber-300 transition-colors">Smart Analytics</h4>
                  <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">
                    Advanced budget tracking and player statistics with performance insights
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-20 text-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="group">
              <div className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform">
                400+
              </div>
              <div className="text-gray-400 text-sm font-medium group-hover:text-gray-300 transition-colors">Cricket Players</div>
            </div>
            <div className="group">
              <div className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform">
                10
              </div>
              <div className="text-gray-400 text-sm font-medium group-hover:text-gray-300 transition-colors">IPL Teams</div>
            </div>
            <div className="group">
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform">
                ₹100Cr
              </div>
              <div className="text-gray-400 text-sm font-medium group-hover:text-gray-300 transition-colors">Team Budget</div>
            </div>
            <div className="group">
              <div className="text-3xl font-bold bg-gradient-to-r from-red-400 to-pink-500 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform">
                Live
              </div>
              <div className="text-gray-400 text-sm font-medium group-hover:text-gray-300 transition-colors">Real-Time</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}