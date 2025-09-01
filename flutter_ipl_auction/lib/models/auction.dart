import 'package:json_annotation/json_annotation.dart';
import 'room.dart';
import 'player.dart';

part 'auction.g.dart';

@JsonSerializable()
class Bid {
  final String id;
  final String roomId;
  final String playerId;
  final String teamCode;
  final int amount; // in Lakhs
  final DateTime placedAt;

  const Bid({
    required this.id,
    required this.roomId,
    required this.playerId,
    required this.teamCode,
    required this.amount,
    required this.placedAt,
  });

  factory Bid.fromJson(Map<String, dynamic> json) => _$BidFromJson(json);
  Map<String, dynamic> toJson() => _$BidToJson(this);

  String get amountFormatted => '₹${(amount / 100).toStringAsFixed(1)} Cr';
}

@JsonSerializable()
class Skip {
  final String id;
  final String roomId;
  final String playerId;
  final String teamCode;
  final DateTime skippedAt;

  const Skip({
    required this.id,
    required this.roomId,
    required this.playerId,
    required this.teamCode,
    required this.skippedAt,
  });

  factory Skip.fromJson(Map<String, dynamic> json) => _$SkipFromJson(json);
  Map<String, dynamic> toJson() => _$SkipToJson(this);
}

@JsonSerializable()
class AuctionState {
  final Room room;
  final Player? currentPlayer;
  final Bid? lastBid;
  final List<Bid> bids;
  final List<RoomTeam> teams;
  final List<Skip> skips;
  final bool isActive;
  final int? nextMinBid;

  const AuctionState({
    required this.room,
    this.currentPlayer,
    this.lastBid,
    required this.bids,
    required this.teams,
    required this.skips,
    required this.isActive,
    this.nextMinBid,
  });

  factory AuctionState.fromJson(Map<String, dynamic> json) => _$AuctionStateFromJson(json);
  Map<String, dynamic> toJson() => _$AuctionStateToJson(this);

  String? get nextMinBidFormatted => 
      nextMinBid != null ? '₹${(nextMinBid! / 100).toStringAsFixed(1)} Cr' : null;
}

@JsonSerializable()
class SquadPlayer {
  final String id;
  final String roomId;
  final String teamCode;
  final String playerId;
  final int price; // final winning bid in Lakhs
  final DateTime purchasedAt;
  final Player? player; // populated in some responses

  const SquadPlayer({
    required this.id,
    required this.roomId,
    required this.teamCode,
    required this.playerId,
    required this.price,
    required this.purchasedAt,
    this.player,
  });

  factory SquadPlayer.fromJson(Map<String, dynamic> json) => _$SquadPlayerFromJson(json);
  Map<String, dynamic> toJson() => _$SquadPlayerToJson(this);

  String get priceFormatted => '₹${(price / 100).toStringAsFixed(1)} Cr';
}

@JsonSerializable()
class TeamSummary {
  final RoomTeam team;
  final List<SquadPlayer> players;

  const TeamSummary({
    required this.team,
    required this.players,
  });

  factory TeamSummary.fromJson(Map<String, dynamic> json) => _$TeamSummaryFromJson(json);
  Map<String, dynamic> toJson() => _$TeamSummaryToJson(this);

  int get totalSpent => players.fold(0, (sum, p) => sum + p.price);
  String get totalSpentFormatted => '₹${(totalSpent / 100).toStringAsFixed(1)} Cr';
}