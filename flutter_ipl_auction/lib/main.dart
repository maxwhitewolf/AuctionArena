import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'providers/app_state.dart';
import 'screens/home_screen.dart';
import 'screens/room_screen.dart';
import 'screens/team_selection_screen.dart';
import 'screens/auction_screen.dart';
import 'screens/summary_screen.dart';

void main() {
  runApp(const IPLAuctionApp());
}

class IPLAuctionApp extends StatelessWidget {
  const IPLAuctionApp({super.key});

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (context) => AppState(),
      child: MaterialApp(
        title: 'IPL Auction',
        debugShowCheckedModeBanner: false,
        theme: ThemeData(
          colorScheme: ColorScheme.fromSeed(
            seedColor: const Color(0xFF1565C0),
            brightness: Brightness.light,
          ),
          useMaterial3: true,
          appBarTheme: const AppBarTheme(
            centerTitle: true,
            elevation: 0,
          ),
        ),
        home: const HomeScreen(),
        routes: {
          '/': (context) => const HomeScreen(),
          '/room': (context) => const RoomScreen(roomCode: 'DEMO'),
          '/team-selection': (context) => const TeamSelectionScreen(roomCode: 'DEMO'),
          '/auction': (context) => const AuctionScreen(roomCode: 'DEMO'),
          '/summary': (context) => const SummaryScreen(roomCode: 'DEMO'),
        },
      ),
    );
  }
}