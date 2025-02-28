import React, { useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import { useSelector } from 'react-redux';
import {RootState } from '@/store';




const SAMPLE_EVENTS = [
  {
    id: '1',
    title: 'Tech Conference 2025',
    date: '2025-03-15',
    location: 'San Francisco, CA',
    image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800',
    description: 'Join us for the biggest tech conference of 2025, featuring leading experts in AI, blockchain, and more.',
  },
  {
    id: '2',
    title: 'Music Festival',
    date: '2025-04-20',
    location: 'Austin, TX',
    image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800',
    description: 'A three-day music festival featuring top artists from around the world.',
  },
];

export default function EventsScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const router = useRouter();
  const events = useSelector((state:RootState)=>state.events.events);


  const handleEventPress = (event) => {
    router.push({
      pathname: '/(tabs)/events/[id]',
      params: { id: event.id, ...event }
    });
  };

  const renderEvent = ({ item }) => (
    <TouchableOpacity
      style={[styles.eventCard, isDark && styles.darkCard]}
      onPress={() => handleEventPress(item)}
    >
      <Image source={{ uri: item.image }} style={styles.eventImage}  />
      <View style={styles.eventInfo}>
        <Text style={[styles.eventTitle, isDark && styles.darkText]}>{item.title}</Text>
        <Text style={[styles.eventDetails, isDark && styles.darkText]}>{item.date}</Text>
        <Text style={[styles.eventDetails, isDark && styles.darkText]}>{item.location}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, isDark && styles.darkContainer]}>
      <FlatList
        data={events}
        renderItem={renderEvent}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  darkContainer: {
    backgroundColor: '#000',
  },
  listContainer: {
    padding: 16,
  },
  eventCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  darkCard: {
    backgroundColor: '#1a1a1a',
  },
  eventImage: {
    width: '100%',
    height: 200,
  },
  eventInfo: {
    padding: 16,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  eventDetails: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  darkText: {
    color: '#fff',
  },
});