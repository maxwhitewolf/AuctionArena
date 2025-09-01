import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';

const IPL_TEAMS = {
  'CSK': { name: 'Chennai Super Kings', color: '#FFD700' },
  'MI': { name: 'Mumbai Indians', color: '#004BA0' },
  'RCB': { name: 'Royal Challengers Bangalore', color: '#D41E2F' },
  'KKR': { name: 'Kolkata Knight Riders', color: '#3A2A6B' },
  'SRH': { name: 'Sunrisers Hyderabad', color: '#FF6600' },
  'RR': { name: 'Rajasthan Royals', color: '#ED1C94' },
  'DC': { name: 'Delhi Capitals', color: '#17479E' },
  'PBKS': { name: 'Punjab Kings', color: '#DD1F2D' },
  'LSG': { name: 'Lucknow Super Giants', color: '#0057B8' },
  'GT': { name: 'Gujarat Titans', color: '#1B2951' },
};

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [roomCode, setRoomCode] = useState('');
  const [username, setUsername] = useState('');
  const [roomName, setRoomName] = useState('');
  const [selectedTeam, setSelectedTeam] = useState(null);

  const createRoom = async () => {
    if (!roomName.trim() || !username.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/rooms', {
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
      Alert.alert('Error', 'Network error. Please try again.');
    }
  };

  const joinRoom = async () => {
    if (!roomCode.trim() || !username.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/rooms/join', {
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
      Alert.alert('Error', 'Network error. Please try again.');
    }
  };

  const renderHomeScreen = () => (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🏏 IPL Auction 2024</Text>
        <Text style={styles.subtitle}>Build Your Dream Team</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Create Room</Text>
        <TextInput
          style={styles.input}
          placeholder="Room Name"
          value={roomName}
          onChangeText={setRoomName}
        />
        <TextInput
          style={styles.input}
          placeholder="Your Name"
          value={username}
          onChangeText={setUsername}
        />
        <TouchableOpacity style={[styles.button, styles.createButton]} onPress={createRoom}>
          <Text style={styles.buttonText}>Create Room</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Join Room</Text>
        <TextInput
          style={styles.input}
          placeholder="Room Code"
          value={roomCode}
          onChangeText={setRoomCode}
          autoCapitalize="characters"
          maxLength={6}
        />
        <TextInput
          style={styles.input}
          placeholder="Your Name"
          value={username}
          onChangeText={setUsername}
        />
        <TouchableOpacity style={[styles.button, styles.joinButton]} onPress={joinRoom}>
          <Text style={styles.buttonText}>Join Room</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  const renderTeamSelection = () => (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Select Your Team</Text>
        <Text style={styles.subtitle}>Room: {roomCode}</Text>
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
          >
            <Text style={styles.teamCode}>{code}</Text>
            <Text style={styles.teamName}>{team.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {selectedTeam && (
        <TouchableOpacity
          style={[styles.button, styles.confirmButton]}
          onPress={() => setCurrentScreen('auction')}
        >
          <Text style={styles.buttonText}>Confirm {selectedTeam}</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );

  const renderAuctionScreen = () => (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🔴 LIVE AUCTION</Text>
        <Text style={styles.subtitle}>Room: {roomCode} | Team: {selectedTeam}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Current Player</Text>
        <View style={styles.playerCard}>
          <Text style={styles.playerName}>Virat Kohli</Text>
          <Text style={styles.playerRole}>Batsman • India</Text>
          <Text style={styles.basePrice}>Base Price: ₹2.0 Cr</Text>
        </View>

        <View style={styles.bidInfo}>
          <View style={styles.bidColumn}>
            <Text style={styles.bidLabel}>Current Bid</Text>
            <Text style={styles.bidAmount}>₹15.5 Cr</Text>
            <Text style={styles.bidTeam}>by RCB</Text>
          </View>
          <View style={styles.bidColumn}>
            <Text style={styles.bidLabel}>Next Min Bid</Text>
            <Text style={styles.nextBid}>₹16.0 Cr</Text>
          </View>
        </View>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity style={[styles.button, styles.bidButton]}>
          <Text style={styles.buttonText}>BID ₹16.0 Cr</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.skipButton]}>
          <Text style={styles.buttonText}>SKIP</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Your Team ({selectedTeam})</Text>
        <Text style={styles.teamStats}>Purse Left: ₹85.5 Cr</Text>
        <Text style={styles.teamStats}>Players: 12/20 • Overseas: 3/5</Text>
      </View>
    </ScrollView>
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
      <StatusBar style="light" />
      {renderCurrentScreen()}
    </View>
  );
}

const styles = StyleSheet.create({
  app: {
    flex: 1,
    backgroundColor: '#1565C0',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 8,
    textAlign: 'center',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  button: {
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  createButton: {
    backgroundColor: '#4CAF50',
  },
  joinButton: {
    backgroundColor: '#2196F3',
  },
  confirmButton: {
    backgroundColor: '#FF6600',
    margin: 20,
  },
  bidButton: {
    backgroundColor: '#4CAF50',
    flex: 1,
    marginRight: 8,
  },
  skipButton: {
    backgroundColor: '#FF6600',
    flex: 1,
    marginLeft: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  teamGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  teamCard: {
    width: '48%',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  selectedTeam: {
    borderWidth: 3,
    borderColor: 'white',
  },
  teamCode: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  teamName: {
    color: 'white',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },
  playerCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  playerName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  playerRole: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  basePrice: {
    fontSize: 14,
    color: '#888',
  },
  bidInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 16,
  },
  bidColumn: {
    alignItems: 'center',
  },
  bidLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  bidAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  nextBid: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  bidTeam: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  teamStats: {
    fontSize: 16,
    marginBottom: 4,
  },
});