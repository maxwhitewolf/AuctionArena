import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TEAM_COLORS } from "@/lib/team-colors";
import type { TeamSummary } from "@shared/schema";

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
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          <i className="fas fa-users mr-2"></i>
          Team Player Comparison
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {Object.entries(playersByRole).map(([role, players]) => (
            <div key={role}>
              <h3 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
                {role}s ({players.length})
              </h3>
              
              <div className="overflow-x-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 min-w-fit">
                  {players
                    .sort((a, b) => b.price - a.price) // Sort by price descending
                    .map((squadPlayer) => {
                      const colors = TEAM_COLORS[squadPlayer.teamCode as keyof typeof TEAM_COLORS];
                      return (
                        <div
                          key={squadPlayer.id}
                          className="bg-white rounded-lg border-2 shadow-sm hover:shadow-md transition-shadow p-4"
                          style={{ borderColor: colors?.primary || '#e5e7eb' }}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-sm text-gray-900 truncate">
                                {squadPlayer.player.name}
                              </h4>
                              <p className="text-xs text-gray-600">
                                {squadPlayer.player.nationality}
                              </p>
                            </div>
                            <Badge
                              className="text-xs ml-2 shrink-0"
                              style={{
                                backgroundColor: colors?.primary || '#6b7280',
                                color: colors?.text || 'white'
                              }}
                            >
                              {squadPlayer.teamCode}
                            </Badge>
                          </div>
                          
                          <div className="text-center">
                            <div className="text-lg font-bold text-green-600">
                              ₹{(squadPlayer.price / 100).toFixed(1)} Cr
                            </div>
                            <div className="text-xs text-gray-500">
                              {colors?.name || squadPlayer.teamCode}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary Stats */}
        <div className="mt-8 pt-6 border-t">
          <h3 className="text-xl font-semibold mb-4 text-center">Auction Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-600">{allPlayers.length}</div>
              <div className="text-sm text-gray-600">Total Players Sold</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-600">
                ₹{(allPlayers.reduce((sum, p) => sum + p.price, 0) / 100).toFixed(1)} Cr
              </div>
              <div className="text-sm text-gray-600">Total Spent</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-purple-600">
                ₹{allPlayers.length > 0 ? (allPlayers.reduce((sum, p) => sum + p.price, 0) / allPlayers.length / 100).toFixed(1) : '0'} Cr
              </div>
              <div className="text-sm text-gray-600">Average Price</div>
            </div>
            <div className="bg-orange-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-orange-600">
                {allPlayers.filter(p => p.player.nationality !== 'India').length}
              </div>
              <div className="text-sm text-gray-600">Overseas Players</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}