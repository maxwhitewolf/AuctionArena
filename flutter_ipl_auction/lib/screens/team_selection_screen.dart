import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';
import '../providers/app_state.dart';
import '../constants/ipl_teams.dart';
import '../widgets/gradient_button.dart';

class TeamSelectionScreen extends StatefulWidget {
  final String roomCode;

  const TeamSelectionScreen({super.key, required this.roomCode});

  @override
  State<TeamSelectionScreen> createState() => _TeamSelectionScreenState();
}

class _TeamSelectionScreenState extends State<TeamSelectionScreen> {
  List<String> availableTeams = [];
  String? selectedTeam;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _loadData();
    });
  }

  Future<void> _loadData() async {
    final appState = context.read<AppState>();
    await appState.loadRoomData(widget.roomCode);
    final teams = await appState.getAvailableTeams();
    setState(() {
      availableTeams = teams;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<AppState>(
      builder: (context, appState, child) {
        final roomData = appState.roomData;
        
        if (roomData == null) {
          return const Scaffold(
            body: Center(child: CircularProgressIndicator()),
          );
        }

        // Check if user already has a team
        final userTeam = appState.getCurrentUserTeam();
        
        return Scaffold(
          appBar: AppBar(
            title: const Text('Select Your Team'),
            backgroundColor: Colors.transparent,
            elevation: 0,
          ),
          body: Container(
            decoration: const BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
                colors: [Color(0xFF1565C0), Color(0xFF42A5F5)],
              ),
            ),
            child: SafeArea(
              child: Padding(
                padding: const EdgeInsets.all(24.0),
                child: Column(
                  children: [
                    // Instructions Card
                    Card(
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Padding(
                        padding: const EdgeInsets.all(20),
                        child: Column(
                          children: [
                            const Icon(
                              Icons.sports_cricket,
                              size: 48,
                              color: Color(0xFF1565C0),
                            ),
                            const SizedBox(height: 16),
                            Text(
                              userTeam != null
                                  ? 'Your Team: ${teamInfo[userTeam.teamCode]?.name}'
                                  : 'Choose Your IPL Team',
                              style: const TextStyle(
                                fontSize: 20,
                                fontWeight: FontWeight.bold,
                              ),
                              textAlign: TextAlign.center,
                            ),
                            const SizedBox(height: 8),
                            Text(
                              userTeam != null
                                  ? 'Waiting for other players to select their teams...'
                                  : 'Select an IPL team to represent in the auction',
                              style: const TextStyle(
                                color: Colors.grey,
                                fontSize: 14,
                              ),
                              textAlign: TextAlign.center,
                            ),
                          ],
                        ),
                      ),
                    ),
                    
                    const SizedBox(height: 24),
                    
                    // Team Selection Grid
                    if (userTeam == null) ...[
                      Expanded(
                        child: Card(
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(20),
                          ),
                          child: Padding(
                            padding: const EdgeInsets.all(20),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Text(
                                  'Available Teams',
                                  style: TextStyle(
                                    fontSize: 18,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                                const SizedBox(height: 16),
                                Expanded(
                                  child: GridView.builder(
                                    gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                                      crossAxisCount: 2,
                                      crossAxisSpacing: 12,
                                      mainAxisSpacing: 12,
                                      childAspectRatio: 1.2,
                                    ),
                                    itemCount: availableTeams.length,
                                    itemBuilder: (context, index) {
                                      final teamCode = availableTeams[index];
                                      final team = teamInfo[teamCode]!;
                                      final isSelected = selectedTeam == teamCode;
                                      
                                      return GestureDetector(
                                        onTap: () {
                                          setState(() {
                                            selectedTeam = teamCode;
                                          });
                                        },
                                        child: Container(
                                          decoration: BoxDecoration(
                                            gradient: LinearGradient(
                                              colors: team.colors,
                                            ),
                                            borderRadius: BorderRadius.circular(16),
                                            border: Border.all(
                                              color: isSelected
                                                  ? Colors.white
                                                  : Colors.transparent,
                                              width: 3,
                                            ),
                                            boxShadow: isSelected
                                                ? [
                                                    BoxShadow(
                                                      color: team.primaryColor.withOpacity(0.5),
                                                      blurRadius: 12,
                                                      offset: const Offset(0, 4),
                                                    ),
                                                  ]
                                                : null,
                                          ),
                                          child: Column(
                                            mainAxisAlignment: MainAxisAlignment.center,
                                            children: [
                                              Text(
                                                teamCode,
                                                style: const TextStyle(
                                                  color: Colors.white,
                                                  fontSize: 20,
                                                  fontWeight: FontWeight.bold,
                                                ),
                                              ),
                                              const SizedBox(height: 8),
                                              Padding(
                                                padding: const EdgeInsets.symmetric(horizontal: 8),
                                                child: Text(
                                                  team.name,
                                                  style: const TextStyle(
                                                    color: Colors.white,
                                                    fontSize: 12,
                                                    fontWeight: FontWeight.w500,
                                                  ),
                                                  textAlign: TextAlign.center,
                                                  maxLines: 2,
                                                  overflow: TextOverflow.ellipsis,
                                                ),
                                              ),
                                            ],
                                          ),
                                        ),
                                      );
                                    },
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ),
                      
                      const SizedBox(height: 24),
                      
                      // Confirm Button
                      GradientButton(
                        onPressed: selectedTeam != null && !appState.isLoading
                            ? () => _confirmTeamSelection(context)
                            : null,
                        colors: selectedTeam != null
                            ? [teamInfo[selectedTeam]!.primaryColor, teamInfo[selectedTeam]!.colors.last]
                            : [Colors.grey, Colors.grey.shade600],
                        child: appState.isLoading
                            ? const SizedBox(
                                height: 20,
                                width: 20,
                                child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2),
                              )
                            : Text(
                                selectedTeam != null
                                    ? 'Confirm ${teamInfo[selectedTeam]?.code}'
                                    : 'Select a Team',
                                style: const TextStyle(
                                  color: Colors.white,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                      ),
                    ] else ...[
                      // Show current team and other selected teams
                      Expanded(
                        child: Card(
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(20),
                          ),
                          child: Padding(
                            padding: const EdgeInsets.all(20),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Text(
                                  'Selected Teams',
                                  style: TextStyle(
                                    fontSize: 18,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                                const SizedBox(height: 16),
                                Expanded(
                                  child: ListView.builder(
                                    itemCount: roomData.teams.length,
                                    itemBuilder: (context, index) {
                                      final team = roomData.teams[index];
                                      final teamDetails = teamInfo[team.teamCode]!;
                                      final isUserTeam = team.userId == appState.userId;
                                      
                                      return Container(
                                        margin: const EdgeInsets.only(bottom: 12),
                                        padding: const EdgeInsets.all(16),
                                        decoration: BoxDecoration(
                                          gradient: LinearGradient(
                                            colors: teamDetails.colors,
                                          ),
                                          borderRadius: BorderRadius.circular(12),
                                          border: isUserTeam
                                              ? Border.all(color: Colors.white, width: 2)
                                              : null,
                                        ),
                                        child: Row(
                                          children: [
                                            CircleAvatar(
                                              backgroundColor: Colors.white.withOpacity(0.2),
                                              child: Text(
                                                team.teamCode,
                                                style: const TextStyle(
                                                  color: Colors.white,
                                                  fontWeight: FontWeight.bold,
                                                  fontSize: 12,
                                                ),
                                              ),
                                            ),
                                            const SizedBox(width: 12),
                                            Expanded(
                                              child: Column(
                                                crossAxisAlignment: CrossAxisAlignment.start,
                                                children: [
                                                  Text(
                                                    teamDetails.name,
                                                    style: const TextStyle(
                                                      color: Colors.white,
                                                      fontWeight: FontWeight.bold,
                                                      fontSize: 16,
                                                    ),
                                                  ),
                                                  Text(
                                                    team.username,
                                                    style: const TextStyle(
                                                      color: Colors.white,
                                                      fontSize: 14,
                                                    ),
                                                  ),
                                                ],
                                              ),
                                            ),
                                            if (isUserTeam)
                                              const Icon(
                                                Icons.check_circle,
                                                color: Colors.white,
                                              ),
                                          ],
                                        ),
                                      );
                                    },
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ),
                      
                      const SizedBox(height: 24),
                      
                      // Start Auction Button (for host only)
                      if (appState.isHost)
                        GradientButton(
                          onPressed: roomData.teams.length >= 2 && !appState.isLoading
                              ? () => _startAuction(context)
                              : null,
                          colors: const [Color(0xFF4CAF50), Color(0xFF66BB6A)],
                          child: appState.isLoading
                              ? const SizedBox(
                                  height: 20,
                                  width: 20,
                                  child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2),
                                )
                              : Text(
                                  roomData.teams.length >= 2
                                      ? 'Start Auction'
                                      : 'Waiting for Teams',
                                  style: const TextStyle(
                                    color: Colors.white,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                        ),
                    ],
                    
                    // Error display
                    if (appState.error != null)
                      Container(
                        margin: const EdgeInsets.only(top: 16),
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: Colors.red.withOpacity(0.1),
                          borderRadius: BorderRadius.circular(8),
                          border: Border.all(color: Colors.red.withOpacity(0.3)),
                        ),
                        child: Row(
                          children: [
                            const Icon(Icons.error, color: Colors.red, size: 20),
                            const SizedBox(width: 8),
                            Expanded(
                              child: Text(
                                appState.error!,
                                style: const TextStyle(color: Colors.red, fontSize: 12),
                              ),
                            ),
                          ],
                        ),
                      ),
                  ],
                ),
              ),
            ),
          ),
        );
      },
    );
  }

  Future<void> _confirmTeamSelection(BuildContext context) async {
    if (selectedTeam == null) return;

    final appState = context.read<AppState>();
    await appState.selectTeam(selectedTeam!);

    if (appState.error == null) {
      // Reload data to show the updated team selection
      await _loadData();
    }
  }

  Future<void> _startAuction(BuildContext context) async {
    final appState = context.read<AppState>();
    await appState.startAuction();

    if (appState.error == null) {
      if (mounted) {
        context.go('/auction/${widget.roomCode}');
      }
    }
  }
}