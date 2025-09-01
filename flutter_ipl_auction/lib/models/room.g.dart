// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'room.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Room _$RoomFromJson(Map<String, dynamic> json) => Room(
      id: json['id'] as String,
      code: json['code'] as String,
      name: json['name'] as String,
      status: json['status'] as String,
      hostUserId: json['hostUserId'] as String,
      currentPlayerId: json['currentPlayerId'] as String?,
      currentDeadlineAt: json['currentDeadlineAt'] == null
          ? null
          : DateTime.parse(json['currentDeadlineAt'] as String),
      countdownSeconds: json['countdownSeconds'] as int,
      version: json['version'] as int,
      createdAt: DateTime.parse(json['createdAt'] as String),
    );

Map<String, dynamic> _$RoomToJson(Room instance) => <String, dynamic>{
      'id': instance.id,
      'code': instance.code,
      'name': instance.name,
      'status': instance.status,
      'hostUserId': instance.hostUserId,
      'currentPlayerId': instance.currentPlayerId,
      'currentDeadlineAt': instance.currentDeadlineAt?.toIso8601String(),
      'countdownSeconds': instance.countdownSeconds,
      'version': instance.version,
      'createdAt': instance.createdAt.toIso8601String(),
    };

RoomMember _$RoomMemberFromJson(Map<String, dynamic> json) => RoomMember(
      id: json['id'] as String,
      roomId: json['roomId'] as String,
      userId: json['userId'] as String,
      username: json['username'] as String,
      role: json['role'] as String,
      joinedAt: DateTime.parse(json['joinedAt'] as String),
      selectionOrder: json['selectionOrder'] as int?,
      hasEnded: json['hasEnded'] as bool,
    );

Map<String, dynamic> _$RoomMemberToJson(RoomMember instance) =>
    <String, dynamic>{
      'id': instance.id,
      'roomId': instance.roomId,
      'userId': instance.userId,
      'username': instance.username,
      'role': instance.role,
      'joinedAt': instance.joinedAt.toIso8601String(),
      'selectionOrder': instance.selectionOrder,
      'hasEnded': instance.hasEnded,
    };

RoomTeam _$RoomTeamFromJson(Map<String, dynamic> json) => RoomTeam(
      id: json['id'] as String,
      roomId: json['roomId'] as String,
      teamCode: json['teamCode'] as String,
      userId: json['userId'] as String,
      username: json['username'] as String,
      selectionOrder: json['selectionOrder'] as int,
      purseLeft: json['purseLeft'] as int,
      totalCount: json['totalCount'] as int,
      overseasCount: json['overseasCount'] as int,
      hasEnded: json['hasEnded'] as bool,
    );

Map<String, dynamic> _$RoomTeamToJson(RoomTeam instance) => <String, dynamic>{
      'id': instance.id,
      'roomId': instance.roomId,
      'teamCode': instance.teamCode,
      'userId': instance.userId,
      'username': instance.username,
      'selectionOrder': instance.selectionOrder,
      'purseLeft': instance.purseLeft,
      'totalCount': instance.totalCount,
      'overseasCount': instance.overseasCount,
      'hasEnded': instance.hasEnded,
    };

RoomWithMembers _$RoomWithMembersFromJson(Map<String, dynamic> json) =>
    RoomWithMembers(
      room: Room.fromJson(json['room'] as Map<String, dynamic>),
      members: (json['members'] as List<dynamic>)
          .map((e) => RoomMember.fromJson(e as Map<String, dynamic>))
          .toList(),
      teams: (json['teams'] as List<dynamic>)
          .map((e) => RoomTeam.fromJson(e as Map<String, dynamic>))
          .toList(),
      currentPlayer: json['currentPlayer'] == null
          ? null
          : Player.fromJson(json['currentPlayer'] as Map<String, dynamic>),
    );

Map<String, dynamic> _$RoomWithMembersToJson(RoomWithMembers instance) =>
    <String, dynamic>{
      'room': instance.room,
      'members': instance.members,
      'teams': instance.teams,
      'currentPlayer': instance.currentPlayer,
    };