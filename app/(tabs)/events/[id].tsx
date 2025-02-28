import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function EventDetailsScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <ScrollView style={[styles.container, isDark && styles.darkContainer]}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={[styles.backButton, isDark && styles.darkBackButton]} 
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={isDark ? '#fff' : '#000'} />
        </TouchableOpacity>
      </View>
      
      <Image source={{ uri: params.image as string }} style={styles.image} />

      <View style={styles.content}>
        <Text style={[styles.title, isDark && styles.darkText]}>{params.title}</Text>
        
        <View style={styles.infoContainer}>
          <View style={styles.infoItem}>
            <Ionicons name="calendar" size={20} color={isDark ? '#fff' : '#666'} />
            <Text style={[styles.infoText, isDark && styles.darkText]}>{params.date}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Ionicons name="location" size={20} color={isDark ? '#fff' : '#666'} />
            <Text style={[styles.infoText, isDark && styles.darkText]}>{params.location}</Text>
          </View>
        </View>

        <Text style={[styles.description, isDark && styles.darkText]}>
          {params.description}
        </Text>

        <TouchableOpacity style={styles.registerButton}>
          <Text style={styles.registerButtonText}>Register for Event</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
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
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    padding: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  darkBackButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  image: {
    width: '100%',
    height: 300,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  darkText: {
    color: '#fff',
  },
  infoContainer: {
    marginBottom: 20,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 16,
    color: '#666',
    marginLeft: 8,
  },
  description: {
    fontSize: 16,
    color: '#444',
    lineHeight: 24,
    marginBottom: 24,
  },
  registerButton: {
    backgroundColor: '#4c669f',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});