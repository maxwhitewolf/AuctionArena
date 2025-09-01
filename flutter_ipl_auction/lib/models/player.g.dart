// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'player.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Player _$PlayerFromJson(Map<String, dynamic> json) => Player(
      id: json['id'] as String,
      name: json['name'] as String,
      role: json['role'] as String,
      nationality: json['nationality'] as String,
      basePrice: json['basePrice'] as int,
      imageUrl: json['imageUrl'] as String?,
      stats: json['stats'] as Map<String, dynamic>?,
    );

Map<String, dynamic> _$PlayerToJson(Player instance) => <String, dynamic>{
      'id': instance.id,
      'name': instance.name,
      'role': instance.role,
      'nationality': instance.nationality,
      'basePrice': instance.basePrice,
      'imageUrl': instance.imageUrl,
      'stats': instance.stats,
    };

PlayerQueue _$PlayerQueueFromJson(Map<String, dynamic> json) => PlayerQueue(
      id: json['id'] as String,
      roomId: json['roomId'] as String,
      playerId: json['playerId'] as String,
      queueOrder: json['queueOrder'] as int,
      status: json['status'] as String,
      isAuctioning: json['isAuctioning'] as bool,
    );

Map<String, dynamic> _$PlayerQueueToJson(PlayerQueue instance) =>
    <String, dynamic>{
      'id': instance.id,
      'roomId': instance.roomId,
      'playerId': instance.playerId,
      'queueOrder': instance.queueOrder,
      'status': instance.status,
      'isAuctioning': instance.isAuctioning,
    };