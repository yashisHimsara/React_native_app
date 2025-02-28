import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { addEvent } from '@/store/slices/eventsSlice';
import uuid from 'react-native-uuid';
import * as FileSystem from 'expo-file-system';

export default function CreateEventScreen() {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);

  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const router = useRouter();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const dispatch = useDispatch();

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      Alert.alert(
        'Authentication Required',
        'Please login or register to create events',
        [
          { text: 'Login', onPress: () => router.push('/login') },
          { text: 'Cancel', style: 'cancel' }
        ]
      );
    }
  }, [isAuthenticated]);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'You need to grant permission to access the gallery.');
      return;
    }

    // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 1,
    });

    if (!result.canceled) {
      const pickedImageUri = result.assets[0].uri;

      // Generate a unique file name
      const fileName = pickedImageUri.split('/').pop();
      const localUri = `${FileSystem.documentDirectory}${fileName}`;

      try {
        // Move the file to local storage
        await FileSystem.moveAsync({
          from: pickedImageUri,
          to: localUri,
        });

        setImage(localUri);
      } catch (error) {
        console.error('Error saving image:', error);
        Alert.alert('Error', 'Could not save image.');
      }
    }
  };

  const handleCreateEvent = () => {
    if (!isAuthenticated) {
      Alert.alert('Error', 'Please login to create events');
      return;
    }

    if (!title || !date || !location || !description) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }



    dispatch(addEvent({  id: uuid.v4(), title, date, location, description, image: image,createdBy: '' }));
    console.log({ title, date, location, description, image });
    setTitle('');
    setDate('');
    setLocation('');
    setDescription('');
    setImage(null);

    Alert.alert('Success', 'Event created successfully!');
  };

  if (!isAuthenticated) {
    return (
      <View style={[styles.container, isDark && styles.darkContainer, styles.centerContent]}>
        <Text style={[styles.title, isDark && styles.darkText]}>Authentication Required</Text>
        <Text style={[styles.subtitle, isDark && styles.darkText]}>
          Please login or register to create events
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/login')}
        >
          <Text style={styles.buttonText}>Go to Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, isDark && styles.darkContainer]}>
      <View style={styles.content}>
        <Text style={[styles.title, isDark && styles.darkText]}>Create New Event</Text>
        
        <TouchableOpacity style={styles.imageContainer} onPress={pickImage}>
          {image ? (
            <Image source={{ uri: image }} style={styles.image} />
          ) : (
            <View style={[styles.placeholder, isDark && styles.darkPlaceholder]}>
              <Text style={[styles.placeholderText, isDark && styles.darkText]}>
                Tap to add event image
              </Text>
            </View>
          )}
        </TouchableOpacity>

        <TextInput
          style={[styles.input, isDark && styles.darkInput]}
          placeholder="Event Title"
          placeholderTextColor={isDark ? '#888' : '#666'}
          value={title}
          onChangeText={setTitle}
        />

        <TextInput
          style={[styles.input, isDark && styles.darkInput]}
          placeholder="Date (YYYY-MM-DD)"
          placeholderTextColor={isDark ? '#888' : '#666'}
          value={date}
          onChangeText={setDate}
        />

        <TextInput
          style={[styles.input, isDark && styles.darkInput]}
          placeholder="Location"
          placeholderTextColor={isDark ? '#888' : '#666'}
          value={location}
          onChangeText={setLocation}
        />

        <TextInput
          style={[styles.input, styles.textArea, isDark && styles.darkInput]}
          placeholder="Description"
          placeholderTextColor={isDark ? '#888' : '#666'}
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
        />

        <TouchableOpacity style={styles.button} onPress={handleCreateEvent}>
          <Text style={styles.buttonText}>Create Event</Text>
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
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  darkText: {
    color: '#fff',
  },
  imageContainer: {
    width: '100%',
    height: 200,
    marginBottom: 20,
    borderRadius: 10,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  darkPlaceholder: {
    backgroundColor: '#333',
  },
  placeholderText: {
    color: '#666',
    fontSize: 16,
  },
  input: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  darkInput: {
    backgroundColor: '#1a1a1a',
    borderColor: '#333',
    color: '#fff',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#4c669f',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});