import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'dart:async';
import '../providers/app_state.dart';
import '../constants/ipl_teams.dart';
import '../widgets/gradient_button.dart';

class AuctionScreen extends StatefulWidget {
  final String roomCode;

  const AuctionScreen({super.key, required this.roomCode});

  @override
  State<AuctionScreen> createState() => _AuctionScreenState();
}

class _AuctionScreenState extends State<AuctionScreen> {
  Timer? _pollingTimer;
  
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _loadAuctionData();
      _startPolling();
    });
  }

  @override
  void dispose() {
    _pollingTimer?.cancel();
    super.dispose();
  }

  void _startPolling() {
    _pollingTimer = Timer.periodic(const Duration(seconds: 2), (timer) {
      if (mounted) {
        context.read<AppState>().loadAuctionState();
      }
    });
  }

  Future<void> _loadAuctionData() async {
    final appState = context.read<AppState>();
    await appState.loadRoomData(widget.roomCode);
    await appState.loadAuctionState();
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<AppState>(
      builder: (context, appState, child) {
        final auctionState = appState.auctionState;
        final userTeam = appState.getCurrentUserTeam();
        
        if (auctionState == null || userTeam == null) {
          return const Scaffold(
            body: Center(child: CircularProgressIndicator()),
          );
        }

        final currentPlayer = auctionState.currentPlayer;
        final lastBid = auctionState.lastBid;
        
        return Scaffold(
          appBar: AppBar(
            title: const Text('Live Auction'),
            backgroundColor: Colors.transparent,
            elevation: 0,
            actions: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                margin: const EdgeInsets.only(right: 16),
                decoration: BoxDecoration(
                  color: Colors.green,
                  borderRadius: BorderRadius.circular(20),
                ),
                child: const Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(Icons.circle, color: Colors.white, size: 8),
                    SizedBox(width: 4),
                    Text('LIVE', style: TextStyle(color: Colors.white, fontSize: 12)),
                  ],
                ),
              ),
            ],
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
              child: currentPlayer != null 
                  ? _buildAuctionView(context, appState, currentPlayer, lastBid, userTeam)
                  : _buildWaitingView(),
            ),
          ),
        );
      },
    );
  }

  Widget _buildWaitingView() {
    return const Center(
      child: Card(
        margin: EdgeInsets.all(24),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        child: Padding(
          padding: EdgeInsets.all(32),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              CircularProgressIndicator(),
              SizedBox(height: 16),
              Text(
                'Preparing auction...',
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.w600),
              ),
              SizedBox(height: 8),
              Text(
                'Please wait while we set up the player queue',
                style: TextStyle(color: Colors.grey),
                textAlign: TextAlign.center,
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildAuctionView(BuildContext context, AppState appState, dynamic currentPlayer, dynamic lastBid, dynamic userTeam) {
    final nextMinBid = appState.auctionState?.nextMinBid ?? (currentPlayer?.basePrice ?? 0);
    final canBid = _canUserBid(userTeam, nextMinBid, currentPlayer);
    
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        children: [
          // Current Player Card
          Card(
            shape: const RoundedRectangleBorder(borderRadius: BorderRadius.all(Radius.circular(20))),
            child: Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                children: [
                  // Player Image and Info
                  Row(
                    children: [
                      Container(
                        width: 80,
                        height: 80,
                        decoration: BoxDecoration(
                          color: Colors.grey.shade200,
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: const Icon(Icons.person, size: 40, color: Colors.grey),
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              currentPlayer?.name ?? '',
                              style: const TextStyle(
                                fontSize: 20,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            const SizedBox(height: 4),
                            Row(
                              children: [
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                  decoration: BoxDecoration(
                                    color: _getRoleColor(currentPlayer?.role),
                                    borderRadius: BorderRadius.circular(12),
                                  ),
                                  child: Text(
                                    currentPlayer?.role ?? '',
                                    style: const TextStyle(
                                      color: Colors.white,
                                      fontSize: 12,
                                      fontWeight: FontWeight.w500,
                                    ),
                                  ),
                                ),
                                const SizedBox(width: 8),
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                  decoration: BoxDecoration(
                                    color: currentPlayer?.nationality == 'India' 
                                        ? Colors.orange : Colors.blue,
                                    borderRadius: BorderRadius.circular(12),
                                  ),
                                  child: Text(
                                    currentPlayer?.nationality ?? '',
                                    style: const TextStyle(
                                      color: Colors.white,
                                      fontSize: 12,
                                      fontWeight: FontWeight.w500,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 8),
                            Text(
                              'Base Price: ₹${((currentPlayer?.basePrice ?? 0) / 100).toStringAsFixed(1)} Cr',
                              style: const TextStyle(
                                fontSize: 14,
                                color: Colors.grey,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                  
                  const SizedBox(height: 20),
                  
                  // Current Bid Info
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: Colors.grey.shade50,
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              'Current Bid',
                              style: TextStyle(
                                fontSize: 12,
                                color: Colors.grey,
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                            Text(
                              lastBid != null 
                                  ? '₹${((lastBid.amount ?? 0) / 100).toStringAsFixed(1)} Cr'
                                  : 'No bids yet',
                              style: const TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            if (lastBid != null)
                              Text(
                                'by ${lastBid.teamCode}',
                                style: TextStyle(
                                  fontSize: 12,
                                  color: teamInfo[lastBid.teamCode]?.primaryColor ?? Colors.grey,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                          ],
                        ),
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.end,
                          children: [
                            const Text(
                              'Next Min Bid',
                              style: TextStyle(
                                fontSize: 12,
                                color: Colors.grey,
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                            Text(
                              '₹${(nextMinBid / 100).toStringAsFixed(1)} Cr',
                              style: const TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                                color: Colors.green,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
          
          const SizedBox(height: 16),
          
          // User Team Info
          Card(
            shape: const RoundedRectangleBorder(borderRadius: BorderRadius.all(Radius.circular(16))),
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      color: teamInfo[userTeam.teamCode]?.primaryColor,
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Text(
                      userTeam.teamCode,
                      style: const TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Purse Left: ₹${(userTeam.purseLeft / 100).toStringAsFixed(1)} Cr',
                          style: const TextStyle(fontWeight: FontWeight.w600),
                        ),
                        Text(
                          'Players: ${userTeam.totalCount}/20 • Overseas: ${userTeam.overseasCount}/5',
                          style: const TextStyle(fontSize: 12, color: Colors.grey),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
          
          const Spacer(),
          
          // Action Buttons
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16.0),
            child: Row(
              children: [
                Expanded(
                  child: GradientButton(
                    onPressed: canBid && !appState.isLoading
                        ? () => _placeBid(context, userTeam.teamCode, nextMinBid)
                        : null,
                    colors: canBid
                        ? [Colors.green, Colors.green.shade600]
                        : [Colors.grey, Colors.grey.shade600],
                    child: appState.isLoading
                        ? const SizedBox(
                            height: 20,
                            width: 20,
                            child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2),
                          )
                        : Text(
                            canBid 
                                ? 'BID ₹${(nextMinBid / 100).toStringAsFixed(1)} Cr'
                                : 'Cannot Bid',
                            style: const TextStyle(
                              color: Colors.white,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: GradientButton(
                    onPressed: !appState.isLoading
                        ? () => _skipPlayer(context, userTeam.teamCode)
                        : null,
                    colors: const [Colors.orange, Colors.deepOrange],
                    child: const Text(
                      'SKIP',
                      style: TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
          
          const SizedBox(height: 16),
        ],
      ),
    );
  }

  bool _canUserBid(dynamic userTeam, int nextMinBid, dynamic currentPlayer) {
    if (userTeam.hasEnded || userTeam.totalCount >= 20) return false;
    if (userTeam.purseLeft < nextMinBid) return false;
    if (currentPlayer?.nationality != 'India' && userTeam.overseasCount >= 5) return false;
    return true;
  }

  Color _getRoleColor(String? role) {
    switch (role) {
      case 'Batsman': return Colors.blue;
      case 'Bowler': return Colors.red;
      case 'All-Rounder': return Colors.green;
      case 'Wicket-Keeper': return Colors.purple;
      default: return Colors.grey;
    }
  }

  Future<void> _placeBid(BuildContext context, String teamCode, int amount) async {
    final appState = context.read<AppState>();
    await appState.placeBid(teamCode: teamCode, amount: amount);
  }

  Future<void> _skipPlayer(BuildContext context, String teamCode) async {
    final appState = context.read<AppState>();
    await appState.skipPlayer(teamCode);
  }
}