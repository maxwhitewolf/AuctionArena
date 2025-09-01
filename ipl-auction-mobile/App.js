import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, Alert, Animated, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');

const IPL_TEAMS = {
  'CSK': { name: 'Chennai Super Kings', color: '#FBBF24', gradient: ['#FBBF24', '#F59E0B'] },
  'MI': { name: 'Mumbai Indians', color: '#3B82F6', gradient: ['#3B82F6', '#1D4ED8'] },
  'RCB': { name: 'Royal Challengers Bangalore', color: '#EF4444', gradient: ['#EF4444', '#DC2626'] },
  'KKR': { name: 'Kolkata Knight Riders', color: '#8B5CF6', gradient: ['#8B5CF6', '#7C3AED'] },
  'SRH': { name: 'Sunrisers Hyderabad', color: '#F97316', gradient: ['#F97316', '#EA580C'] },
  'RR': { name: 'Rajasthan Royals', color: '#EC4899', gradient: ['#EC4899', '#DB2777'] },
  'DC': { name: 'Delhi Capitals', color: '#2563EB', gradient: ['#2563EB', '#1D4ED8'] },
  'PBKS': { name: 'Punjab Kings', color: '#DC2626', gradient: ['#DC2626', '#B91C1C'] },
  'LSG': { name: 'Lucknow Super Giants', color: '#06B6D4', gradient: ['#06B6D4', '#0891B2'] },
  'GT': { name: 'Gujarat Titans', color: '#3B82F6', gradient: ['#3B82F6', '#2563EB'] }
};

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [roomCode, setRoomCode] = useState('');
  const [username, setUsername] = useState('');
  const [roomName, setRoomName] = useState('');
  const [selectedTeam, setSelectedTeam] = useState(null);
  
  // Animations
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(50);
  const pulseAnim = new Animated.Value(1);

  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // Continuous pulse animation for live indicator
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const createRoom = async () => {
    if (!roomName.trim() || !username.trim()) {
      Alert.alert('Missing Information', 'Please fill in all fields');
      return;
    }

    try {
      const response = await fetch('https://rest-express-git-main-lilyth0-1.replit.app/api/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomName: roomName.trim(), username: username.trim() }),
      });

      if (response.ok) {
        const data = await response.json();
        setRoomCode(data.room.code);
        setCurrentScreen('room');
      } else {
        Alert.alert('Error', 'Failed to create room');
      }
    } catch (error) {
      Alert.alert('Network Error', 'Please check your connection and try again.');
    }
  };

  const joinRoom = async () => {
    if (!roomCode.trim() || !username.trim()) {
      Alert.alert('Missing Information', 'Please fill in all fields');
      return;
    }

    try {
      const response = await fetch('https://rest-express-git-main-lilyth0-1.replit.app/api/rooms/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomCode: roomCode.trim().toUpperCase(), username: username.trim() }),
      });

      if (response.ok) {
        setCurrentScreen('room');
      } else {
        Alert.alert('Error', 'Failed to join room');
      }
    } catch (error) {
      Alert.alert('Network Error', 'Please check your connection and try again.');
    }
  };

  const renderHomeScreen = () => (
    <Animated.View 
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }
      ]}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.hero}>
          <View style={styles.heroContent}>
            <View style={styles.heroIcon}>
              <Text style={styles.heroIconText}>🏏</Text>
              <Animated.View style={[styles.pulseIndicator, { transform: [{ scale: pulseAnim }] }]} />
            </View>
            <Text style={styles.heroTitle}>IPL Auction Pro</Text>
            <Text style={styles.heroSubtitle}>Premium Cricket Auction Experience</Text>
            
            <View style={styles.featuresRow}>
              <View style={styles.featureBadge}>
                <Text style={styles.featureBadgeText}>₹100 Cr Budget</Text>
              </View>
              <View style={[styles.featureBadge, styles.featureBadgeBlue]}>
                <Text style={styles.featureBadgeText}>10 IPL Teams</Text>
              </View>
              <View style={[styles.featureBadge, styles.featureBadgeGreen]}>
                <Text style={styles.featureBadgeText}>Live Bidding</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Action Cards */}
        <View style={styles.actionCards}>
          {/* Create Room Card */}
          <View style={styles.cardContainer}>
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={[styles.cardIcon, styles.cardIconGreen]}>
                  <Text style={styles.cardIconText}>+</Text>
                </View>
                <Text style={styles.cardTitle}>Create Auction</Text>
                <Text style={styles.cardSubtitle}>Launch a new auction room</Text>
              </View>
              
              <View style={styles.form}>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Room Name</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter a creative room name"
                    placeholderTextColor="#6B7280"
                    value={roomName}
                    onChangeText={setRoomName}
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Your Name</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your display name"
                    placeholderTextColor="#6B7280"
                    value={username}
                    onChangeText={setUsername}
                  />
                </View>
                <TouchableOpacity 
                  style={[styles.button, styles.createButton]} 
                  onPress={createRoom}
                  activeOpacity={0.8}
                >
                  <Text style={styles.buttonText}>Create Auction Room</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Join Room Card */}
          <View style={styles.cardContainer}>
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={[styles.cardIcon, styles.cardIconBlue]}>
                  <Text style={styles.cardIconText}>→</Text>
                </View>
                <Text style={styles.cardTitle}>Join Auction</Text>
                <Text style={styles.cardSubtitle}>Enter room code to join</Text>
              </View>
              
              <View style={styles.form}>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Room Code</Text>
                  <TextInput
                    style={[styles.input, styles.codeInput]}
                    placeholder="000000"
                    placeholderTextColor="#6B7280"
                    value={roomCode}
                    onChangeText={setRoomCode}
                    autoCapitalize="characters"
                    maxLength={6}
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Your Name</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your display name"
                    placeholderTextColor="#6B7280"
                    value={username}
                    onChangeText={setUsername}
                  />
                </View>
                <TouchableOpacity 
                  style={[styles.button, styles.joinButton]} 
                  onPress={joinRoom}
                  activeOpacity={0.8}
                >
                  <Text style={styles.buttonText}>Join Auction Room</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* Stats Section */}
        <View style={styles.statsSection}>
          <Text style={styles.statsTitle}>Premium Features</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>400+</Text>
              <Text style={styles.statLabel}>Players</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumberGreen}>10</Text>
              <Text style={styles.statLabel}>IPL Teams</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumberBlue}>₹100Cr</Text>
              <Text style={styles.statLabel}>Budget</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumberRed}>Live</Text>
              <Text style={styles.statLabel}>Real-Time</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </Animated.View>
  );

  const renderTeamSelection = () => (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Select Your Team</Text>
          <View style={styles.roomCodeBadge}>
            <Text style={styles.roomCodeText}>Room: {roomCode}</Text>
          </View>
        </View>

        <View style={styles.teamGrid}>
          {Object.entries(IPL_TEAMS).map(([code, team]) => (
            <TouchableOpacity
              key={code}
              style={[
                styles.teamCard,
                { backgroundColor: team.color },
                selectedTeam === code && styles.selectedTeam
              ]}
              onPress={() => setSelectedTeam(code)}
              activeOpacity={0.8}
            >
              <View style={styles.teamCardContent}>
                <Text style={styles.teamCode}>{code}</Text>
                <Text style={styles.teamName}>{team.name}</Text>
                {selectedTeam === code && (
                  <View style={styles.selectedIndicator}>
                    <Text style={styles.selectedText}>✓</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {selectedTeam && (
          <Animated.View style={[styles.confirmContainer, { opacity: fadeAnim }]}>
            <TouchableOpacity
              style={[styles.button, styles.confirmButton]}
              onPress={() => setCurrentScreen('auction')}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>Confirm {selectedTeam} Selection</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </ScrollView>
    </Animated.View>
  );

  const renderAuctionScreen = () => (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.liveHeader}>
            <Animated.View style={[styles.liveIndicator, { transform: [{ scale: pulseAnim }] }]} />
            <Text style={styles.liveTitle}>🔴 LIVE AUCTION</Text>
          </View>
          <Text style={styles.subtitle}>Room: {roomCode} | Team: {selectedTeam}</Text>
        </View>

        {/* Current Player */}
        <View style={styles.playerSection}>
          <View style={styles.playerCard}>
            <View style={styles.playerHeader}>
              <View style={styles.playerInfo}>
                <Text style={styles.playerName}>Virat Kohli</Text>
                <Text style={styles.playerRole}>Batsman • India</Text>
                <View style={styles.basePriceBadge}>
                  <Text style={styles.basePriceText}>Base: ₹2.0 Cr</Text>
                </View>
              </View>
              <View style={styles.playerImageContainer}>
                <View style={styles.playerImage}>
                  <Text style={styles.playerImageText}>VK</Text>
                </View>
                <Animated.View style={[styles.starIndicator, { transform: [{ scale: pulseAnim }] }]} />
              </View>
            </View>

            <View style={styles.bidSection}>
              <View style={styles.bidInfo}>
                <View style={styles.bidColumn}>
                  <Text style={styles.bidLabel}>Current Bid</Text>
                  <Text style={styles.bidAmount}>₹15.5 Cr</Text>
                  <View style={styles.teamBadge}>
                    <View style={[styles.teamDot, { backgroundColor: IPL_TEAMS.RCB.color }]} />
                    <Text style={styles.bidTeam}>by RCB</Text>
                  </View>
                </View>
                <View style={styles.bidColumn}>
                  <Text style={styles.bidLabel}>Next Min Bid</Text>
                  <Text style={styles.nextBid}>₹16.0 Cr</Text>
                  <Text style={styles.incrementText}>+₹0.5 Cr</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[styles.button, styles.bidButton]}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>BID ₹16.0 Cr</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.button, styles.skipButton]}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>SKIP PLAYER</Text>
          </TouchableOpacity>
        </View>

        {/* Your Team Status */}
        <View style={styles.teamStatusCard}>
          <Text style={styles.teamStatusTitle}>Your Team ({selectedTeam})</Text>
          <View style={styles.teamStats}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>₹85.5 Cr</Text>
              <Text style={styles.statLabel}>Purse Left</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>12/20</Text>
              <Text style={styles.statLabel}>Players</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>3/8</Text>
              <Text style={styles.statLabel}>Overseas</Text>
            </View>
          </View>
          
          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <Text style={styles.progressLabel}>Squad Progress</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '60%' }]} />
            </View>
          </View>
        </View>
      </ScrollView>
    </Animated.View>
  );

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'home':
        return renderHomeScreen();
      case 'room':
        return renderTeamSelection();
      case 'auction':
        return renderAuctionScreen();
      default:
        return renderHomeScreen();
    }
  };

  return (
    <View style={styles.app}>
      <StatusBar style="light" backgroundColor="#000000" />
      {renderCurrentScreen()}
    </View>
  );
}

const styles = StyleSheet.create({
  app: {
    flex: 1,
    backgroundColor: '#000000',
  },
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  hero: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 40,
    alignItems: 'center',
  },
  heroContent: {
    alignItems: 'center',
  },
  heroIcon: {
    position: 'relative',
    marginBottom: 24,
  },
  heroIconText: {
    fontSize: 60,
  },
  pulseIndicator: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 20,
    height: 20,
    backgroundColor: '#10B981',
    borderRadius: 10,
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#F59E0B',
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: 'rgba(245, 158, 11, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  featuresRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
  },
  featureBadge: {
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  featureBadgeBlue: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    borderColor: 'rgba(59, 130, 246, 0.3)',
  },
  featureBadgeGreen: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  featureBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  actionCards: {
    paddingHorizontal: 20,
    gap: 20,
  },
  cardContainer: {
    marginBottom: 20,
  },
  card: {
    backgroundColor: 'rgba(17, 24, 39, 0.9)',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(75, 85, 99, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  cardHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  cardIcon: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  cardIconGreen: {
    backgroundColor: '#10B981',
  },
  cardIconBlue: {
    backgroundColor: '#3B82F6',
  },
  cardIconText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 20,
  },
  form: {
    gap: 16,
  },
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#D1D5DB',
  },
  input: {
    backgroundColor: 'rgba(31, 41, 55, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(75, 85, 99, 0.5)',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#FFFFFF',
  },
  codeInput: {
    textAlign: 'center',
    fontSize: 24,
    fontFamily: 'monospace',
    letterSpacing: 4,
  },
  button: {
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  createButton: {
    backgroundColor: '#10B981',
  },
  joinButton: {
    backgroundColor: '#3B82F6',
  },
  confirmButton: {
    backgroundColor: '#F59E0B',
    marginHorizontal: 20,
    marginTop: 20,
  },
  bidButton: {
    backgroundColor: '#10B981',
    flex: 1,
    marginRight: 8,
  },
  skipButton: {
    backgroundColor: '#EF4444',
    flex: 1,
    marginLeft: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  liveHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  liveIndicator: {
    width: 12,
    height: 12,
    backgroundColor: '#EF4444',
    borderRadius: 6,
    marginRight: 12,
  },
  liveTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  roomCodeBadge: {
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  roomCodeText: {
    color: '#F59E0B',
    fontSize: 14,
    fontWeight: '600',
  },
  teamGrid: {
    paddingHorizontal: 20,
    gap: 16,
  },
  teamCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  teamCardContent: {
    alignItems: 'center',
  },
  selectedTeam: {
    borderWidth: 3,
    borderColor: '#FFFFFF',
    transform: [{ scale: 1.05 }],
  },
  teamCode: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  teamName: {
    color: '#FFFFFF',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    fontWeight: '500',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  selectedIndicator: {
    position: 'absolute',
    top: -12,
    right: -12,
    width: 32,
    height: 32,
    backgroundColor: '#10B981',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  confirmContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  playerSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  playerCard: {
    backgroundColor: 'rgba(17, 24, 39, 0.9)',
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  playerHeader: {
    backgroundColor: '#F59E0B',
    padding: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
  },
  playerRole: {
    fontSize: 16,
    color: 'rgba(0, 0, 0, 0.7)',
    marginBottom: 12,
    fontWeight: '500',
  },
  basePriceBadge: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  basePriceText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: 'bold',
  },
  playerImageContainer: {
    position: 'relative',
  },
  playerImage: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  playerImageText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  starIndicator: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    backgroundColor: '#10B981',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bidSection: {
    padding: 24,
  },
  bidInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(31, 41, 55, 0.6)',
    borderRadius: 16,
    padding: 20,
  },
  bidColumn: {
    alignItems: 'center',
    flex: 1,
  },
  bidLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 8,
    fontWeight: '500',
  },
  bidAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#10B981',
    marginBottom: 8,
  },
  nextBid: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F59E0B',
    marginBottom: 4,
  },
  incrementText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  teamBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(31, 41, 55, 0.8)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  teamDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  bidTeam: {
    fontSize: 12,
    color: '#D1D5DB',
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 24,
    gap: 12,
  },
  teamStatusCard: {
    backgroundColor: 'rgba(17, 24, 39, 0.9)',
    marginHorizontal: 20,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(75, 85, 99, 0.3)',
  },
  teamStatusTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
  },
  teamStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    alignItems: 'center',
    backgroundColor: 'rgba(31, 41, 55, 0.6)',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 16,
    flex: 1,
    marginHorizontal: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F59E0B',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  progressContainer: {
    gap: 8,
  },
  progressLabel: {
    fontSize: 14,
    color: '#D1D5DB',
    fontWeight: '600',
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(31, 41, 55, 0.8)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#F59E0B',
    borderRadius: 4,
  },
  statsSection: {
    paddingHorizontal: 20,
    paddingVertical: 32,
  },
  statsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: (width - 60) / 2,
    alignItems: 'center',
    marginBottom: 20,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#F59E0B',
    marginBottom: 4,
  },
  statNumberGreen: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#10B981',
    marginBottom: 4,
  },
  statNumberBlue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#3B82F6',
    marginBottom: 4,
  },
  statNumberRed: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#EF4444',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
  },
});