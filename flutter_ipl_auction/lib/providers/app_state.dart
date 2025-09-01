import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/room.dart';
import '../models/player.dart';
import '../models/auction.dart';
import '../services/api_service.dart';

class AppState extends ChangeNotifier {
  final ApiService _apiService = ApiService();
  
  // User state
  String? _userId;
  String? _username;
  String? get userId => _userId;
  String? get username => _username;

  // Room state
  RoomWithMembers? _roomData;
  RoomWithMembers? get roomData => _roomData;
  String? get currentRoomCode => _roomData?.room.code;

  // Auction state
  AuctionState? _auctionState;
  AuctionState? get auctionState => _auctionState;

  // Loading states
  bool _isLoading = false;
  bool get isLoading => _isLoading;

  String? _error;
  String? get error => _error;

  AppState() {
    _loadUserData();
  }

  Future<void> _loadUserData() async {
    final prefs = await SharedPreferences.getInstance();
    _userId = prefs.getString('userId');
    _username = prefs.getString('username');
    notifyListeners();
  }

  Future<void> _saveUserData() async {
    final prefs = await SharedPreferences.getInstance();
    if (_userId != null) await prefs.setString('userId', _userId!);
    if (_username != null) await prefs.setString('username', _username!);
  }

  void _setLoading(bool loading) {
    _isLoading = loading;
    notifyListeners();
  }

  void _setError(String? error) {
    _error = error;
    notifyListeners();
  }

  void clearError() {
    _error = null;
    notifyListeners();
  }

  // Room operations
  Future<void> createRoom({
    required String roomName,
    required String username,
  }) async {
    try {
      _setLoading(true);
      _setError(null);

      final result = await _apiService.createRoom(
        roomName: roomName,
        username: username,
      );

      _userId = result['userId'];
      _username = result['member']['username'];
      await _saveUserData();

      // Load room data
      await loadRoomData(result['room']['code']);
    } catch (e) {
      _setError(e.toString());
    } finally {
      _setLoading(false);
    }
  }

  Future<void> joinRoom({
    required String roomCode,
    required String username,
  }) async {
    try {
      _setLoading(true);
      _setError(null);

      final result = await _apiService.joinRoom(
        roomCode: roomCode,
        username: username,
      );

      _userId = result['userId'];
      _username = result['member']['username'];
      await _saveUserData();

      // Load room data
      await loadRoomData(roomCode);
    } catch (e) {
      _setError(e.toString());
    } finally {
      _setLoading(false);
    }
  }

  Future<void> loadRoomData(String roomCode) async {
    if (_userId == null) return;

    try {
      _roomData = await _apiService.getRoomInfo(roomCode, _userId!);
      notifyListeners();
    } catch (e) {
      _setError(e.toString());
    }
  }

  // Team selection
  Future<void> selectTeam(String teamCode) async {
    if (_roomData == null || _userId == null) return;

    try {
      _setLoading(true);
      _setError(null);

      await _apiService.selectTeam(
        roomCode: _roomData!.room.code,
        userId: _userId!,
        teamCode: teamCode,
      );

      // Reload room data
      await loadRoomData(_roomData!.room.code);
    } catch (e) {
      _setError(e.toString());
    } finally {
      _setLoading(false);
    }
  }

  Future<List<String>> getAvailableTeams() async {
    if (_roomData == null) return [];

    try {
      return await _apiService.getAvailableTeams(_roomData!.room.code);
    } catch (e) {
      _setError(e.toString());
      return [];
    }
  }

  // Auction operations
  Future<void> startAuction() async {
    if (_roomData == null || _userId == null) return;

    try {
      _setLoading(true);
      _setError(null);

      await _apiService.startAuction(_roomData!.room.code, _userId!);
      await loadRoomData(_roomData!.room.code);
    } catch (e) {
      _setError(e.toString());
    } finally {
      _setLoading(false);
    }
  }

  Future<void> loadAuctionState() async {
    if (_roomData == null) return;

    try {
      _auctionState = await _apiService.getAuctionState(_roomData!.room.code);
      notifyListeners();
    } catch (e) {
      _setError(e.toString());
    }
  }

  Future<void> placeBid({
    required String teamCode,
    required int amount,
  }) async {
    if (_roomData == null || _userId == null) return;

    try {
      await _apiService.placeBid(
        roomCode: _roomData!.room.code,
        userId: _userId!,
        teamCode: teamCode,
        amount: amount,
      );

      // Reload auction state
      await loadAuctionState();
    } catch (e) {
      _setError(e.toString());
    }
  }

  Future<void> skipPlayer(String teamCode) async {
    if (_roomData == null || _userId == null) return;

    try {
      await _apiService.skipPlayer(
        roomCode: _roomData!.room.code,
        userId: _userId!,
        teamCode: teamCode,
      );

      // Reload auction state
      await loadAuctionState();
    } catch (e) {
      _setError(e.toString());
    }
  }

  // Get current user's team
  RoomTeam? getCurrentUserTeam() {
    if (_roomData == null || _userId == null) return null;
    
    return _roomData!.teams
        .where((team) => team.userId == _userId)
        .firstOrNull;
  }

  // Check if current user is host
  bool get isHost {
    if (_roomData == null || _userId == null) return false;
    return _roomData!.room.hostUserId == _userId;
  }

  // Logout
  Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.clear();
    
    _userId = null;
    _username = null;
    _roomData = null;
    _auctionState = null;
    _error = null;
    
    notifyListeners();
  }
}