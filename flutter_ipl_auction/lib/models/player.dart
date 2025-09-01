import 'package:json_annotation/json_annotation.dart';

part 'player.g.dart';

@JsonSerializable()
class Player {
  final String id;
  final String name;
  final String role;
  final String nationality;
  final int basePrice; // in Lakhs
  final String? imageUrl;
  final Map<String, dynamic>? stats;

  const Player({
    required this.id,
    required this.name,
    required this.role,
    required this.nationality,
    required this.basePrice,
    this.imageUrl,
    this.stats,
  });

  factory Player.fromJson(Map<String, dynamic> json) => _$PlayerFromJson(json);
  Map<String, dynamic> toJson() => _$PlayerToJson(this);

  String get basePriceFormatted => '₹${(basePrice / 100).toStringAsFixed(1)} Cr';
  bool get isOverseas => nationality != 'India';
}

@JsonSerializable()
class PlayerQueue {
  final String id;
  final String roomId;
  final String playerId;
  final int queueOrder;
  final String status; // 'queued', 'auctioning', 'sold', 'unsold'
  final bool isAuctioning;

  const PlayerQueue({
    required this.id,
    required this.roomId,
    required this.playerId,
    required this.queueOrder,
    required this.status,
    required this.isAuctioning,
  });

  factory PlayerQueue.fromJson(Map<String, dynamic> json) => _$PlayerQueueFromJson(json);
  Map<String, dynamic> toJson() => _$PlayerQueueToJson(this);
}