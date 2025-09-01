import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TEAM_COLORS } from "@/lib/team-colors";
import type { TeamSummary } from "@shared/schema";
import { Users, TrendingUp, DollarSign, Globe, BarChart3 } from "lucide-react";

interface TeamComparisonGridProps {
  teams: TeamSummary[];
}

export function TeamComparisonGrid({ teams }: TeamComparisonGridProps) {
  // Get all unique players across all teams
  const allPlayers = teams.flatMap(team => 
    team.players.map(sp => ({
      ...sp,
      teamCode: team.teamCode,
      teamName: TEAM_COLORS[team.teamCode as keyof typeof TEAM_COLORS]?.name || team.teamCode
    }))
  );

  // Group players by role for better organization
  const playersByRole = allPlayers.reduce((acc, player) => {
    const role = player.player.role;
    if (!acc[role]) acc[role] = [];
    acc[role].push(player);
    return acc;
  }, {} as Record<string, typeof allPlayers>);

  return (
    <Card className="bg-gradient-to-br from-gray-900/90 to-black/90 border-gray-700/50 shadow-2xl">
      <CardHeader className="text-center pb-6">
        <CardTitle className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent flex items-center justify-center space-x-3">
          <Users className="w-8 h-8 text-amber-400" />
          <span>All Auction Players</span>
        </CardTitle>
        <p className="text-gray-400 text-lg">Complete list of all players purchased in this auction</p>
      </CardHeader>
      <CardContent>
        {/* All Players Grid */}
        <div className="mb-10">
          <div className="flex items-center justify-center space-x-3 mb-8">
            <BarChart3 className="w-8 h-8 text-amber-400" />
            <h3 className="text-3xl font-bold text-white">
              All Players ({allPlayers.length})
            </h3>
          </div>
          
          <div className="overflow-x-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6 min-w-fit">
              {allPlayers
                .sort((a, b) => b.price - a.price) // Sort by price descending
                .map((squadPlayer) => {
                  const colors = TEAM_COLORS[squadPlayer.teamCode as keyof typeof TEAM_COLORS];
                  return (
                    <div
                      key={squadPlayer.id}
                      className="bg-gradient-to-br from-gray-800/50 to-gray-700/50 rounded-2xl border-2 shadow-lg hover:shadow-xl transition-all duration-300 p-5 card-hover backdrop-blur-sm"
                      style={{ borderColor: colors?.primary || '#374151' }}
                    >
                      <div className="text-center mb-4">
                        <h4 className="font-bold text-lg text-white truncate mb-1">
                          {squadPlayer.player.name}
                        </h4>
                        <p className="text-sm text-gray-400 font-medium mb-2">
                          {squadPlayer.player.nationality}
                        </p>
                        <Badge
                          className="text-xs font-semibold"
                          style={{
                            backgroundColor: colors?.primary || '#6b7280',
                            color: colors?.text || 'white',
                            borderColor: colors?.primary || '#6b7280'
                          }}
                        >
                          {squadPlayer.teamCode}
                        </Badge>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="bg-gray-800/40 rounded-xl p-3 border border-gray-700/30 text-center">
                          <div className="text-xl font-bold text-green-400 mb-1">
                            ₹{(squadPlayer.price / 100).toFixed(1)} Cr
                          </div>
                          <div className="text-xs text-gray-500 font-medium">Final Price</div>
                        </div>
                        
                        <div className="bg-gray-800/40 rounded-xl p-3 border border-gray-700/30 text-center">
                          <Badge className="text-xs bg-blue-500/20 border-blue-500/30 text-blue-300 font-medium">
                            {squadPlayer.player.role}
                          </Badge>
                        </div>

                        <div className="text-center">
                          <div className="text-xs text-gray-500 font-medium">
                            {colors?.name || squadPlayer.teamCode}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="mt-12 pt-8 border-t border-gray-700/50">
          <h3 className="text-2xl font-bold text-center text-white mb-8">Auction Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-2xl p-6 text-center border border-blue-500/30">
              <Users className="w-8 h-8 text-blue-400 mx-auto mb-3" />
              <div className="text-3xl font-bold text-blue-400 mb-2">{allPlayers.length}</div>
              <div className="text-sm text-gray-400 font-medium">Total Players Sold</div>
            </div>
            <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-2xl p-6 text-center border border-green-500/30">
              <DollarSign className="w-8 h-8 text-green-400 mx-auto mb-3" />
              <div className="text-3xl font-bold text-green-400 mb-2">
                ₹{(allPlayers.reduce((sum, p) => sum + p.price, 0) / 100).toFixed(1)} Cr
              </div>
              <div className="text-sm text-gray-400 font-medium">Total Spent</div>
            </div>
            <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-2xl p-6 text-center border border-purple-500/30">
              <TrendingUp className="w-8 h-8 text-purple-400 mx-auto mb-3" />
              <div className="text-3xl font-bold text-purple-400 mb-2">
                ₹{allPlayers.length > 0 ? (allPlayers.reduce((sum, p) => sum + p.price, 0) / allPlayers.length / 100).toFixed(1) : '0'} Cr
              </div>
              <div className="text-sm text-gray-400 font-medium">Average Price</div>
            </div>
            <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-2xl p-6 text-center border border-orange-500/30">
              <Globe className="w-8 h-8 text-orange-400 mx-auto mb-3" />
              <div className="text-3xl font-bold text-orange-400 mb-2">
                {allPlayers.filter(p => p.player.nationality !== 'India').length}
              </div>
              <div className="text-sm text-gray-400 font-medium">Overseas Players</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}