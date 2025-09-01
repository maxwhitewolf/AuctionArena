import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/app_state.dart';
import '../widgets/gradient_button.dart';
import '../widgets/custom_text_field.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final _createFormKey = GlobalKey<FormState>();
  final _joinFormKey = GlobalKey<FormState>();
  final _roomNameController = TextEditingController();
  final _createUsernameController = TextEditingController();
  final _roomCodeController = TextEditingController();
  final _joinUsernameController = TextEditingController();

  @override
  void dispose() {
    _roomNameController.dispose();
    _createUsernameController.dispose();
    _roomCodeController.dispose();
    _joinUsernameController.dispose();
    super.dispose();
  }

  Future<void> _createRoom() async {
    if (!_createFormKey.currentState!.validate()) return;

    final appState = context.read<AppState>();
    await appState.createRoom(
      roomName: _roomNameController.text.trim(),
      username: _createUsernameController.text.trim(),
    );

    if (appState.error == null && appState.currentRoomCode != null) {
      if (mounted) {
        Navigator.of(context).pushNamed('/room');
      }
    }
  }

  Future<void> _joinRoom() async {
    if (!_joinFormKey.currentState!.validate()) return;

    final appState = context.read<AppState>();
    await appState.joinRoom(
      roomCode: _roomCodeController.text.trim().toUpperCase(),
      username: _joinUsernameController.text.trim(),
    );

    if (appState.error == null && appState.currentRoomCode != null) {
      if (mounted) {
        Navigator.of(context).pushNamed('/room');
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [
              Color(0xFF1565C0),
              Color(0xFF42A5F5),
              Color(0xFF81C784),
            ],
          ),
        ),
        child: SafeArea(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(24.0),
            child: Column(
              children: [
                const SizedBox(height: 40),
                
                // Header
                Container(
                  padding: const EdgeInsets.all(24),
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(24),
                    border: Border.all(
                      color: Colors.white.withOpacity(0.2),
                      width: 1,
                    ),
                  ),
                  child: Column(
                    children: [
                      const Icon(
                        Icons.sports_cricket,
                        size: 60,
                        color: Colors.white,
                      ),
                      const SizedBox(height: 16),
                      const Text(
                        'IPL Auction 2024',
                        style: TextStyle(
                          fontSize: 32,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                        ),
                        textAlign: TextAlign.center,
                      ),
                      const SizedBox(height: 8),
                      Text(
                        'Build Your Dream Team',
                        style: TextStyle(
                          fontSize: 18,
                          color: Colors.white.withOpacity(0.9),
                        ),
                        textAlign: TextAlign.center,
                      ),
                      const SizedBox(height: 24),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                        children: [
                          _buildFeatureChip('₹100 Cr Budget'),
                          _buildFeatureChip('10 IPL Teams'),
                          _buildFeatureChip('Live Bidding'),
                        ],
                      ),
                    ],
                  ),
                ),
                
                const SizedBox(height: 40),
                
                // Create and Join Cards
                Row(
                  children: [
                    Expanded(child: _buildCreateRoomCard()),
                    const SizedBox(width: 16),
                    Expanded(child: _buildJoinRoomCard()),
                  ],
                ),
                
                const SizedBox(height: 32),
                
                // Error display
                Consumer<AppState>(
                  builder: (context, appState, child) {
                    if (appState.error != null) {
                      return Container(
                        margin: const EdgeInsets.only(bottom: 16),
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: Colors.red.withOpacity(0.1),
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: Colors.red.withOpacity(0.3)),
                        ),
                        child: Row(
                          children: [
                            const Icon(Icons.error, color: Colors.red),
                            const SizedBox(width: 12),
                            Expanded(
                              child: Text(
                                appState.error!,
                                style: const TextStyle(color: Colors.red),
                              ),
                            ),
                            IconButton(
                              onPressed: appState.clearError,
                              icon: const Icon(Icons.close, color: Colors.red),
                            ),
                          ],
                        ),
                      );
                    }
                    return const SizedBox.shrink();
                  },
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildFeatureChip(String text) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.2),
        borderRadius: BorderRadius.circular(20),
      ),
      child: Text(
        text,
        style: const TextStyle(
          color: Colors.white,
          fontSize: 12,
          fontWeight: FontWeight.w500,
        ),
      ),
    );
  }

  Widget _buildCreateRoomCard() {
    return Card(
      elevation: 8,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.all(Radius.circular(16))),
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Form(
          key: _createFormKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const Icon(
                Icons.add_circle,
                size: 48,
                color: Color(0xFF4CAF50),
              ),
              const SizedBox(height: 16),
              const Text(
                'Create Room',
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 8),
              const Text(
                'Start a new auction',
                style: TextStyle(
                  color: Colors.grey,
                  fontSize: 14,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 24),
              CustomTextField(
                controller: _roomNameController,
                label: 'Room Name',
                hint: 'Enter room name',
                validator: (value) {
                  if (value == null || value.trim().isEmpty) {
                    return 'Room name is required';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16),
              CustomTextField(
                controller: _createUsernameController,
                label: 'Your Name',
                hint: 'Enter your name',
                validator: (value) {
                  if (value == null || value.trim().isEmpty) {
                    return 'Name is required';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 24),
              Consumer<AppState>(
                builder: (context, appState, child) {
                  return GradientButton(
                    onPressed: appState.isLoading ? null : _createRoom,
                    colors: const [Color(0xFF4CAF50), Color(0xFF66BB6A)],
                    child: appState.isLoading
                        ? const SizedBox(
                            height: 20,
                            width: 20,
                            child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2),
                          )
                        : const Text('Create Room', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                  );
                },
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildJoinRoomCard() {
    return Card(
      elevation: 8,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.all(Radius.circular(16))),
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Form(
          key: _joinFormKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const Icon(
                Icons.door_front_door,
                size: 48,
                color: Color(0xFF2196F3),
              ),
              const SizedBox(height: 16),
              const Text(
                'Join Room',
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 8),
              const Text(
                'Enter room code',
                style: TextStyle(
                  color: Colors.grey,
                  fontSize: 14,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 24),
              CustomTextField(
                controller: _roomCodeController,
                label: 'Room Code',
                hint: 'ABCDEF',
                textCapitalization: TextCapitalization.characters,
                maxLength: 6,
                textAlign: TextAlign.center,
                style: const TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  letterSpacing: 4,
                ),
                validator: (value) {
                  if (value == null || value.trim().length != 6) {
                    return 'Enter 6-digit room code';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16),
              CustomTextField(
                controller: _joinUsernameController,
                label: 'Your Name',
                hint: 'Enter your name',
                validator: (value) {
                  if (value == null || value.trim().isEmpty) {
                    return 'Name is required';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 24),
              Consumer<AppState>(
                builder: (context, appState, child) {
                  return GradientButton(
                    onPressed: appState.isLoading ? null : _joinRoom,
                    colors: const [Color(0xFF2196F3), Color(0xFF42A5F5)],
                    child: appState.isLoading
                        ? const SizedBox(
                            height: 20,
                            width: 20,
                            child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2),
                          )
                        : const Text('Join Room', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                  );
                },
              ),
            ],
          ),
        ),
      ),
    );
  }
}