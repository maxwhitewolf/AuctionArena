// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'auction.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Bid _$BidFromJson(Map<String, dynamic> json) => Bid(
      id: json['id'] as String,
      roomId: json['roomId'] as String,
      playerId: json['playerId'] as String,
      teamCode: json['teamCode'] as String,
      amount: json['amount'] as int,
      placedAt: DateTime.parse(json['placedAt'] as String),
    );

Map<String, dynamic> _$BidToJson(Bid instance) => <String, dynamic>{
      'id': instance.id,
      'roomId': instance.roomId,
      'playerId': instance.playerId,
      'teamCode': instance.teamCode,
      'amount': instance.amount,
      'placedAt': instance.placedAt.toIso8601String(),
    };

Skip _$SkipFromJson(Map<String, dynamic> json) => Skip(
      id: json['id'] as String,
      roomId: json['roomId'] as String,
      playerId: json['playerId'] as String,
      teamCode: json['teamCode'] as String,
      skippedAt: DateTime.parse(json['skippedAt'] as String),
    );

Map<String, dynamic> _$SkipToJson(Skip instance) => <String, dynamic>{
      'id': instance.id,
      'roomId': instance.roomId,
      'playerId': instance.playerId,
      'teamCode': instance.teamCode,
      'skippedAt': instance.skippedAt.toIso8601String(),
    };

AuctionState _$AuctionStateFromJson(Map<String, dynamic> json) => AuctionState(
      room: Room.fromJson(json['room'] as Map<String, dynamic>),
      currentPlayer: json['currentPlayer'] == null
          ? null
          : Player.fromJson(json['currentPlayer'] as Map<String, dynamic>),
      lastBid: json['lastBid'] == null
          ? null
          : Bid.fromJson(json['lastBid'] as Map<String, dynamic>),
      bids: (json['bids'] as List<dynamic>)
          .map((e) => Bid.fromJson(e as Map<String, dynamic>))
          .toList(),
      teams: (json['teams'] as List<dynamic>)
          .map((e) => RoomTeam.fromJson(e as Map<String, dynamic>))
          .toList(),
      skips: (json['skips'] as List<dynamic>)
          .map((e) => Skip.fromJson(e as Map<String, dynamic>))
          .toList(),
      isActive: json['isActive'] as bool,
      nextMinBid: json['nextMinBid'] as int?,
    );

Map<String, dynamic> _$AuctionStateToJson(AuctionState instance) =>
    <String, dynamic>{
      'room': instance.room,
      'currentPlayer': instance.currentPlayer,
      'lastBid': instance.lastBid,
      'bids': instance.bids,
      'teams': instance.teams,
      'skips': instance.skips,
      'isActive': instance.isActive,
      'nextMinBid': instance.nextMinBid,
    };

SquadPlayer _$SquadPlayerFromJson(Map<String, dynamic> json) => SquadPlayer(
      id: json['id'] as String,
      roomId: json['roomId'] as String,
      teamCode: json['teamCode'] as String,
      playerId: json['playerId'] as String,
      price: json['price'] as int,
      purchasedAt: DateTime.parse(json['purchasedAt'] as String),
      player: json['player'] == null
          ? null
          : Player.fromJson(json['player'] as Map<String, dynamic>),
    );

Map<String, dynamic> _$SquadPlayerToJson(SquadPlayer instance) =>
    <String, dynamic>{
      'id': instance.id,
      'roomId': instance.roomId,
      'teamCode': instance.teamCode,
      'playerId': instance.playerId,
      'price': instance.price,
      'purchasedAt': instance.purchasedAt.toIso8601String(),
      'player': instance.player,
    };

TeamSummary _$TeamSummaryFromJson(Map<String, dynamic> json) => TeamSummary(
      team: RoomTeam.fromJson(json['team'] as Map<String, dynamic>),
      players: (json['players'] as List<dynamic>)
          .map((e) => SquadPlayer.fromJson(e as Map<String, dynamic>))
          .toList(),
    );

Map<String, dynamic> _$TeamSummaryToJson(TeamSummary instance) =>
    <String, dynamic>{
      'team': instance.team,
      'players': instance.players,
    };