import React, { useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Alert, ActivityIndicator, Text } from 'react-native';
import axios from 'axios';
import { MaterialIcons } from '@expo/vector-icons';

const SearchBar = ({ setSearchedLocation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      Alert.alert('Error', 'Search query cannot be empty');
      return;
    }

    setLoading(true);
    try {
      // Only encodeURIComponent once and properly trigger API call
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&limit=1`
      );

      if (response.data.length > 0) {
        const { lat, lon } = response.data[0];
        setSearchedLocation({
          latitude: parseFloat(lat),
          longitude: parseFloat(lon),
        });
      } else {
        Alert.alert('No Results', 'No location found. Please try a different search.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch location. Check your internet connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.searchContainer}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search for a place"
        placeholderTextColor="#9E9E9E"
        value={searchQuery}
        onChangeText={setSearchQuery}
        returnKeyType="search"
        onSubmitEditing={handleSearch} // Search on pressing "enter" as well
      />
      <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
        {loading ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <>
            <MaterialIcons name="search" size={24} color="white" />
          </>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    position: 'absolute',
    top: 60,
    width: '90%',
    alignSelf: 'center',
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 5,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#F1F3F5',
    color: '#333',
  },
  searchButton: {
    backgroundColor: '#6C63FF',
    padding: 10,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SearchBar;
