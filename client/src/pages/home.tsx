import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";

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
                <h1 className="text-2xl font-bold text-gray-900">IPL Auction</h1>
                <p className="text-sm text-gray-600">Build Your Dream Team</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center py-12">
          <div className="relative bg-gradient-to-r from-blue-600 via-blue-600 to-green-500 rounded-3xl p-12 text-white overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-4 left-4 text-6xl">🏏</div>
              <div className="absolute bottom-4 right-4 text-6xl">🏆</div>
              <div className="absolute top-1/2 left-1/4 text-4xl transform -rotate-12">🏅</div>
            </div>
            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-bold mb-4">IPL Auction 2024</h2>
              <p className="text-xl md:text-2xl mb-8 opacity-90">Create your dream team in the ultimate cricket auction experience</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full">
                  <span className="text-lg font-medium">₹100 Crore Budget</span>
                </div>
                <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full">
                  <span className="text-lg font-medium">10 IPL Teams</span>
                </div>
                <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full">
                  <span className="text-lg font-medium">Live Bidding</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Create Room Card */}
          <Card className="shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-plus text-white text-2xl"></i>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Create Room</h3>
                <p className="text-gray-600">Start a new auction and invite friends</p>
              </div>
              <form onSubmit={handleCreateRoom} className="space-y-4">
                <div>
                  <Label htmlFor="roomName">Room Name</Label>
                  <Input
                    id="roomName"
                    placeholder="Enter room name"
                    value={createForm.roomName}
                    onChange={(e) => setCreateForm({ ...createForm, roomName: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="username">Your Name</Label>
                  <Input
                    id="username"
                    placeholder="Enter your name"
                    value={createForm.username}
                    onChange={(e) => setCreateForm({ ...createForm, username: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                  disabled={createRoomMutation.isPending}
                >
                  {createRoomMutation.isPending ? (
                    <>Creating...</>
                  ) : (
                    <>
                      <i className="fas fa-rocket mr-2"></i>Create Room
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Join Room Card */}
          <Card className="shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-door-open text-white text-2xl"></i>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Join Room</h3>
                <p className="text-gray-600">Enter a room code to join existing auction</p>
              </div>
              <form onSubmit={handleJoinRoom} className="space-y-4">
                <div>
                  <Label htmlFor="roomCode">Room Code</Label>
                  <Input
                    id="roomCode"
                    placeholder="Enter 6-digit code"
                    maxLength={6}
                    value={joinForm.roomCode}
                    onChange={(e) => setJoinForm({ ...joinForm, roomCode: e.target.value.toUpperCase() })}
                    className="mt-1 text-center text-2xl font-mono tracking-widest"
                  />
                </div>
                <div>
                  <Label htmlFor="joinUsername">Your Name</Label>
                  <Input
                    id="joinUsername"
                    placeholder="Enter your name"
                    value={joinForm.username}
                    onChange={(e) => setJoinForm({ ...joinForm, username: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-600 hover:from-blue-700 hover:to-blue-700"
                  disabled={joinRoomMutation.isPending}
                >
                  {joinRoomMutation.isPending ? (
                    <>Joining...</>
                  ) : (
                    <>
                      <i className="fas fa-sign-in-alt mr-2"></i>Join Room
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <div className="mt-16">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">Auction Features</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-users text-white"></i>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Team Selection</h4>
              <p className="text-gray-600">Choose from 10 IPL teams in turn-based selection</p>
            </div>
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-gavel text-white"></i>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Live Bidding</h4>
              <p className="text-gray-600">Real-time auction with countdown timers</p>
            </div>
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-chart-line text-white"></i>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Budget Tracking</h4>
              <p className="text-gray-600">Monitor spending and purse balance</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
