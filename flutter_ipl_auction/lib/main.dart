import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';
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
      child: MaterialApp.router(
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
        routerConfig: _router,
      ),
    );
  }
}

final GoRouter _router = GoRouter(
  routes: [
    GoRoute(
      path: '/',
      builder: (context, state) => const HomeScreen(),
    ),
    GoRoute(
      path: '/room/:code',
      builder: (context, state) {
        final code = state.pathParameters['code']!;
        return RoomScreen(roomCode: code);
      },
    ),
    GoRoute(
      path: '/team-selection/:code',
      builder: (context, state) {
        final code = state.pathParameters['code']!;
        return TeamSelectionScreen(roomCode: code);
      },
    ),
    GoRoute(
      path: '/auction/:code',
      builder: (context, state) {
        final code = state.pathParameters['code']!;
        return AuctionScreen(roomCode: code);
      },
    ),
    GoRoute(
      path: '/summary/:code',
      builder: (context, state) {
        final code = state.pathParameters['code']!;
        return SummaryScreen(roomCode: code);
      },
    ),
  ],
);