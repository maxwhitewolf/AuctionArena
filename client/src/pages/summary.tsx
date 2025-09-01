import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { TEAM_COLORS } from "@/lib/team-colors";
import { TeamComparisonGrid } from "@/components/team-comparison-grid";
import type { TeamSummary } from "@shared/schema";
import { Trophy, Download, Share2, Plus, Star, DollarSign, Users } from "lucide-react";

export default function Summary() {
  const { code } = useParams();

  const { data, isLoading } = useQuery<{ teams: TeamSummary[] }>({
    queryKey: ["/api/rooms", code, "summary"],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="max-w-7xl mx-auto p-8">
          <Skeleton className="h-8 w-64 mb-8 bg-gray-800/50" />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-64 w-full bg-gray-800/50" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const { teams } = data;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-500/5 rounded-full blur-3xl animate-float"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-gray-800/50 bg-black/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-xl">
                <Trophy className="w-6 h-6 text-black" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">Auction Summary</h1>
                <p className="text-sm text-gray-400 font-medium">Room: <span className="text-amber-400 font-mono">{code}</span></p>
              </div>
            </div>
            <div className="flex items-center space-x-2 bg-green-500/20 px-4 py-2 rounded-full border border-green-500/30">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-green-300 text-sm font-medium">Complete</span>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Trophy Section */}
        <div className="text-center py-16 mb-16">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-yellow-500/20 rounded-3xl blur-xl"></div>
            <div className="relative bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-xl rounded-3xl p-12 border border-gray-800/50">
              <div className="w-24 h-24 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl animate-float">
                <Trophy className="w-12 h-12 text-black" />
              </div>
              <h2 className="text-5xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent mb-4">
                Auction Complete!
              </h2>
              <p className="text-xl text-gray-300">All teams have been finalized with their dream squads</p>
            </div>
          </div>
        </div>

        {/* Final Team Standings */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {teams.map((team, index) => {
            const colors = TEAM_COLORS[team.teamCode as keyof typeof TEAM_COLORS];
            const totalSpent = team.players.reduce((sum: number, p: any) => sum + p.price, 0);
            
            return (
              <Card key={team.id} className="overflow-hidden shadow-2xl card-hover bg-gradient-to-br from-gray-900/90 to-black/90 border-gray-700/50">
                <div 
                  className="p-6 relative"
                  style={{ 
                    background: `linear-gradient(to right, ${colors.primary}, ${colors.secondary})`,
                    color: colors.text
                  }}
                >
                  {/* Rank indicator */}
                  {index < 3 && (
                    <div className="absolute top-2 left-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                        index === 0 ? 'bg-yellow-500 text-black' :
                        index === 1 ? 'bg-gray-300 text-black' :
                        'bg-amber-600 text-white'
                      }`}>
                        #{index + 1}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between pt-4">
                    <div>
                      <h3 className="text-xl font-bold">{colors.name}</h3>
                      <p className="opacity-80 font-medium">{team.username}</p>
                    </div>
                    <div 
                      className="w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-lg shadow-xl"
                      style={{ backgroundColor: colors.primary, color: colors.text }}
                    >
                      {team.teamCode}
                    </div>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-center bg-gray-800/30 p-4 rounded-xl">
                      <DollarSign className="w-5 h-5 text-green-400 mx-auto mb-2" />
                      <div className="text-xl font-bold text-green-400">
                        ₹{((team.purseLeft) / 100).toFixed(1)} Cr
                      </div>
                      <div className="text-xs text-gray-500 font-medium">Remaining</div>
                    </div>
                    <div className="text-center bg-gray-800/30 p-4 rounded-xl">
                      <Users className="w-5 h-5 text-blue-400 mx-auto mb-2" />
                      <div className="text-xl font-bold text-blue-400">{team.totalCount}</div>
                      <div className="text-xs text-gray-500 font-medium">Players</div>
                    </div>
                    <div className="text-center bg-gray-800/30 p-4 rounded-xl">
                      <Star className="w-5 h-5 text-amber-400 mx-auto mb-2" />
                      <div className="text-xl font-bold text-amber-400">
                        ₹{(totalSpent / 100).toFixed(1)} Cr
                      </div>
                      <div className="text-xs text-gray-500 font-medium">Spent</div>
                    </div>
                    <div className="text-center bg-gray-800/30 p-4 rounded-xl">
                      <div className="text-xl font-bold text-purple-400">{team.overseasCount}</div>
                      <div className="text-xs text-gray-500 font-medium">Overseas</div>
                    </div>
                  </div>

                  {/* Top Players */}
                  {team.players.length > 0 && (
                    <div className="mb-6">
                      <h4 className="font-semibold text-white mb-3 flex items-center space-x-2">
                        <Star className="w-4 h-4 text-amber-400" />
                        <span>Key Players</span>
                      </h4>
                      <div className="space-y-3">
                        {team.players
                          .sort((a: any, b: any) => b.price - a.price)
                          .slice(0, 3)
                          .map((squadPlayer: any) => (
                            <div key={squadPlayer.id} className="flex justify-between items-center p-3 bg-gray-800/30 rounded-lg border border-gray-700/30">
                              <span className="font-medium text-white text-sm">{squadPlayer.player.name}</span>
                              <span className="text-green-400 font-bold text-sm">
                                ₹{(squadPlayer.price / 100).toFixed(1)} Cr
                              </span>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}

                  <Button 
                    data-testid={`button-view-squad-${team.teamCode}`}
                    className="w-full py-3 font-semibold transition-all duration-300 button-glow"
                    style={{ 
                      background: `linear-gradient(to right, ${colors.primary}, ${colors.secondary})`,
                      color: colors.text,
                      border: 'none'
                    }}
                  >
                    View Full Squad
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Team Comparison Grid */}
        <div className="mb-12">
          <TeamComparisonGrid teams={teams} />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <Button 
            data-testid="button-export-results"
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-4 font-semibold text-lg button-glow shadow-lg hover:shadow-green-500/25 transition-all duration-300"
          >
            <Download className="w-5 h-5 mr-2" />
            Export Results
          </Button>
          <Button 
            data-testid="button-share-results"
            variant="outline" 
            className="px-8 py-4 font-semibold text-lg bg-gray-800/30 border-gray-600 hover:bg-gray-700/50 hover:border-gray-500 text-white hover:text-gray-200 transition-all duration-300"
          >
            <Share2 className="w-5 h-5 mr-2" />
            Share Results
          </Button>
          <Button 
            data-testid="button-new-auction"
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 font-semibold text-lg button-glow shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
            onClick={() => window.location.href = '/'}
          >
            <Plus className="w-5 h-5 mr-2" />
            New Auction
          </Button>
        </div>
      </main>
    </div>
  );
}