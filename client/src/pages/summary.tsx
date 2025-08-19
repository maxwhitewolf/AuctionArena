import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { TEAM_COLORS } from "@/lib/team-colors";
import type { TeamSummary } from "@shared/schema";

export default function Summary() {
  const { code } = useParams();

  const { data, isLoading } = useQuery<{ teams: TeamSummary[] }>({
    queryKey: ["/api/rooms", code, "summary"],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto p-8">
          <Skeleton className="h-8 w-64 mb-8" />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-64 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const { teams } = data;

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
                <h1 className="text-2xl font-bold text-gray-900">Auction Summary</h1>
                <p className="text-sm text-gray-600">Room: {code}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Trophy Section */}
        <div className="text-center py-8">
          <div className="w-20 h-20 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-trophy text-white text-3xl"></i>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-2">Auction Complete!</h2>
          <p className="text-xl text-gray-600">All teams have been finalized</p>
        </div>

        {/* Final Team Standings */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {teams.map((team) => {
            const colors = TEAM_COLORS[team.teamCode as keyof typeof TEAM_COLORS];
            const totalSpent = team.players.reduce((sum: number, p: any) => sum + p.price, 0);
            
            return (
              <Card key={team.id} className="overflow-hidden shadow-lg">
                <div 
                  className="p-4"
                  style={{ 
                    background: `linear-gradient(to right, ${colors.primary}, ${colors.secondary})`,
                    color: colors.text
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold">{colors.name}</h3>
                      <p className="opacity-80">{team.username}</p>
                    </div>
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center font-bold"
                      style={{ backgroundColor: colors.primary, color: colors.text }}
                    >
                      {team.teamCode}
                    </div>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        ₹{((team.purseLeft) / 100).toFixed(1)} Cr
                      </div>
                      <div className="text-sm text-gray-600">Remaining</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{team.totalCount}</div>
                      <div className="text-sm text-gray-600">Players</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">
                        ₹{(totalSpent / 100).toFixed(1)} Cr
                      </div>
                      <div className="text-sm text-gray-600">Spent</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{team.overseasCount}</div>
                      <div className="text-sm text-gray-600">Overseas</div>
                    </div>
                  </div>

                  {/* Top Players */}
                  {team.players.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Key Players</h4>
                      <div className="space-y-2">
                        {team.players
                          .sort((a: any, b: any) => b.price - a.price)
                          .slice(0, 3)
                          .map((squadPlayer: any) => (
                            <div key={squadPlayer.id} className="flex justify-between text-sm">
                              <span className="font-medium">{squadPlayer.player.name}</span>
                              <span className="text-green-600 font-semibold">
                                ₹{(squadPlayer.price / 100).toFixed(1)} Cr
                              </span>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}

                  <Button 
                    className="w-full"
                    style={{ 
                      backgroundColor: colors.primary,
                      color: colors.text,
                      borderColor: colors.primary
                    }}
                  >
                    View Full Squad
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-3 hover:from-green-600 hover:to-green-700">
            <i className="fas fa-download mr-2"></i>Export Results
          </Button>
          <Button variant="outline" className="px-8 py-3">
            <i className="fas fa-share mr-2"></i>Share Results
          </Button>
          <Button 
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
            onClick={() => window.location.href = '/'}
          >
            <i className="fas fa-plus mr-2"></i>New Auction
          </Button>
        </div>
      </main>
    </div>
  );
}