import 'package:json_annotation/json_annotation.dart';
import 'player.dart';

part 'room.g.dart';

@JsonSerializable()
class Room {
  final String id;
  final String code;
  final String name;
  final String status; // 'lobby', 'team_selection', 'paused', 'live', 'ended'
  final String hostUserId;
  final String? currentPlayerId;
  final DateTime? currentDeadlineAt;
  final int countdownSeconds;
  final int version;
  final DateTime createdAt;

  const Room({
    required this.id,
    required this.code,
    required this.name,
    required this.status,
    required this.hostUserId,
    this.currentPlayerId,
    this.currentDeadlineAt,
    required this.countdownSeconds,
    required this.version,
    required this.createdAt,
  });

  factory Room.fromJson(Map<String, dynamic> json) => _$RoomFromJson(json);
  Map<String, dynamic> toJson() => _$RoomToJson(this);

  bool get isLobby => status == 'lobby';
  bool get isTeamSelection => status == 'team_selection';
  bool get isLive => status == 'live';
  bool get isEnded => status == 'ended';
  bool get isPaused => status == 'paused';
}

@JsonSerializable()
class RoomMember {
  final String id;
  final String roomId;
  final String userId;
  final String username;
  final String role; // 'host', 'team', 'spectator'
  final DateTime joinedAt;
  final int? selectionOrder;
  final bool hasEnded;

  const RoomMember({
    required this.id,
    required this.roomId,
    required this.userId,
    required this.username,
    required this.role,
    required this.joinedAt,
    this.selectionOrder,
    required this.hasEnded,
  });

  factory RoomMember.fromJson(Map<String, dynamic> json) => _$RoomMemberFromJson(json);
  Map<String, dynamic> toJson() => _$RoomMemberToJson(this);

  bool get isHost => role == 'host';
  bool get isTeam => role == 'team';
  bool get isSpectator => role == 'spectator';
}

@JsonSerializable()
class RoomTeam {
  final String id;
  final String roomId;
  final String teamCode;
  final String userId;
  final String username;
  final int selectionOrder;
  final int purseLeft; // in Lakhs
  final int totalCount;
  final int overseasCount;
  final bool hasEnded;

  const RoomTeam({
    required this.id,
    required this.roomId,
    required this.teamCode,
    required this.userId,
    required this.username,
    required this.selectionOrder,
    required this.purseLeft,
    required this.totalCount,
    required this.overseasCount,
    required this.hasEnded,
  });

  factory RoomTeam.fromJson(Map<String, dynamic> json) => _$RoomTeamFromJson(json);
  Map<String, dynamic> toJson() => _$RoomTeamToJson(this);

  String get purseFormatted => '₹${(purseLeft / 100).toStringAsFixed(1)} Cr';
  String get slotsRemaining => '${20 - totalCount} slots';
}

@JsonSerializable()
class RoomWithMembers {
  final Room room;
  final List<RoomMember> members;
  final List<RoomTeam> teams;
  final Player? currentPlayer;

  const RoomWithMembers({
    required this.room,
    required this.members,
    required this.teams,
    this.currentPlayer,
  });

  factory RoomWithMembers.fromJson(Map<String, dynamic> json) => _$RoomWithMembersFromJson(json);
  Map<String, dynamic> toJson() => _$RoomWithMembersToJson(this);
}