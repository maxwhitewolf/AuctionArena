import 'package:flutter/material.dart';

const List<String> iplTeams = [
  'CSK', 'MI', 'RCB', 'KKR', 'SRH', 'RR', 'DC', 'PBKS', 'LSG', 'GT'
];

const Map<String, TeamInfo> teamInfo = {
  'CSK': TeamInfo(
    code: 'CSK',
    name: 'Chennai Super Kings',
    colors: [Color(0xFFFFD700), Color(0xFF1F4E79)],
    primaryColor: Color(0xFFFFD700),
  ),
  'MI': TeamInfo(
    code: 'MI',
    name: 'Mumbai Indians',
    colors: [Color(0xFF004BA0), Color(0xFF00A5E6)],
    primaryColor: Color(0xFF004BA0),
  ),
  'RCB': TeamInfo(
    code: 'RCB',
    name: 'Royal Challengers Bangalore',
    colors: [Color(0xFFD41E2F), Color(0xFFFFD700)],
    primaryColor: Color(0xFFD41E2F),
  ),
  'KKR': TeamInfo(
    code: 'KKR',
    name: 'Kolkata Knight Riders',
    colors: [Color(0xFF3A2A6B), Color(0xFFFFD700)],
    primaryColor: Color(0xFF3A2A6B),
  ),
  'SRH': TeamInfo(
    code: 'SRH',
    name: 'Sunrisers Hyderabad',
    colors: [Color(0xFFFF6600), Color(0xFF000000)],
    primaryColor: Color(0xFFFF6600),
  ),
  'RR': TeamInfo(
    code: 'RR',
    name: 'Rajasthan Royals',
    colors: [Color(0xFFED1C94), Color(0xFF254AA5)],
    primaryColor: Color(0xFFED1C94),
  ),
  'DC': TeamInfo(
    code: 'DC',
    name: 'Delhi Capitals',
    colors: [Color(0xFF17479E), Color(0xFFDC143C)],
    primaryColor: Color(0xFF17479E),
  ),
  'PBKS': TeamInfo(
    code: 'PBKS',
    name: 'Punjab Kings',
    colors: [Color(0xFFDD1F2D), Color(0xFF800080)],
    primaryColor: Color(0xFFDD1F2D),
  ),
  'LSG': TeamInfo(
    code: 'LSG',
    name: 'Lucknow Super Giants',
    colors: [Color(0xFF0057B8), Color(0xFFFFD700)],
    primaryColor: Color(0xFF0057B8),
  ),
  'GT': TeamInfo(
    code: 'GT',
    name: 'Gujarat Titans',
    colors: [Color(0xFF1B2951), Color(0xFF00BFFF)],
    primaryColor: Color(0xFF1B2951),
  ),
};

class TeamInfo {
  final String code;
  final String name;
  final List<Color> colors;
  final Color primaryColor;

  const TeamInfo({
    required this.code,
    required this.name,
    required this.colors,
    required this.primaryColor,
  });
}

const int startingPurseLakhs = 10000; // 100 Crore = 10,000 Lakhs
const int teamMinPlayers = 15;
const int teamMaxPlayers = 20;
const int maxOverseasPlayers = 5;

const List<String> playerRoles = ['Batsman', 'Bowler', 'All-Rounder', 'Wicket-Keeper'];

// Bidding increment logic
int nextIncrement(int amountL) {
  if (amountL < 100) return 10; // < ₹1 Cr
  if (amountL < 200) return 20; // ₹1–2 Cr
  return 25; // ≥ ₹2 Cr
}

int alignToStep(int amountL, int stepL) {
  return ((amountL + stepL - 1) ~/ stepL) * stepL;
}

int expectedNextBid(int baseL, int? lastBidL) {
  if (lastBidL == null) {
    final step = nextIncrement(baseL);
    return alignToStep(baseL, step).clamp(baseL, double.infinity).toInt();
  }
  final step = nextIncrement(lastBidL);
  return lastBidL + step;
}