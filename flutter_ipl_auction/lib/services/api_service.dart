import 'dart:convert';
import 'package:dio/dio.dart';
import '../models/room.dart';
import '../models/player.dart';
import '../models/auction.dart';

class ApiService {
  static const String baseUrl = 'http://localhost:5000/api';
  late final Dio _dio;

  ApiService() {
    _dio = Dio(BaseOptions(
      baseUrl: baseUrl,
      connectTimeout: const Duration(seconds: 10),
      receiveTimeout: const Duration(seconds: 10),
      headers: {
        'Content-Type': 'application/json',
      },
    ));

    // Add interceptors for logging
    _dio.interceptors.add(LogInterceptor(
      requestBody: true,
      responseBody: true,
      logPrint: (obj) => print(obj),
    ));
  }

  // Room operations
  Future<Map<String, dynamic>> createRoom({
    required String roomName,
    required String username,
  }) async {
    final response = await _dio.post('/rooms', data: {
      'roomName': roomName,
      'username': username,
    });
    return response.data;
  }

  Future<Map<String, dynamic>> joinRoom({
    required String roomCode,
    required String username,
  }) async {
    final response = await _dio.post('/rooms/join', data: {
      'roomCode': roomCode,
      'username': username,
    });
    return response.data;
  }

  Future<RoomWithMembers> getRoomInfo(String roomCode, String userId) async {
    final response = await _dio.get('/rooms/$roomCode',
        queryParameters: {'userId': userId});
    return RoomWithMembers.fromJson(response.data);
  }

  // Team selection
  Future<void> selectTeam({
    required String roomCode,
    required String userId,
    required String teamCode,
  }) async {
    await _dio.post('/rooms/$roomCode/select-team', data: {
      'userId': userId,
      'teamCode': teamCode,
    });
  }

  Future<List<String>> getAvailableTeams(String roomCode) async {
    final response = await _dio.get('/rooms/$roomCode/available-teams');
    return List<String>.from(response.data['teams']);
  }

  // Auction operations
  Future<void> startAuction(String roomCode, String userId) async {
    await _dio.post('/rooms/$roomCode/start-auction', data: {
      'userId': userId,
    });
  }

  Future<AuctionState> getAuctionState(String roomCode) async {
    final response = await _dio.get('/rooms/$roomCode/auction');
    return AuctionState.fromJson(response.data);
  }

  Future<void> placeBid({
    required String roomCode,
    required String userId,
    required String teamCode,
    required int amount,
  }) async {
    await _dio.post('/rooms/$roomCode/bid', data: {
      'userId': userId,
      'teamCode': teamCode,
      'amount': amount,
    });
  }

  Future<void> skipPlayer({
    required String roomCode,
    required String userId,
    required String teamCode,
  }) async {
    await _dio.post('/rooms/$roomCode/skip', data: {
      'userId': userId,
      'teamCode': teamCode,
    });
  }

  // Player operations
  Future<List<Player>> getAllPlayers() async {
    final response = await _dio.get('/players');
    return (response.data as List)
        .map((json) => Player.fromJson(json))
        .toList();
  }

  // Summary operations
  Future<List<TeamSummary>> getRoomSummary(String roomCode) async {
    final response = await _dio.get('/rooms/$roomCode/summary');
    return (response.data as List)
        .map((json) => TeamSummary.fromJson(json))
        .toList();
  }

  // Error handling
  String _getErrorMessage(DioException error) {
    if (error.response?.data is Map<String, dynamic>) {
      return error.response?.data['message'] ?? 'An error occurred';
    }
    return error.message ?? 'Network error occurred';
  }
}