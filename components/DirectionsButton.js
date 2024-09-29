import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View, Alert, ActivityIndicator, Text } from 'react-native';
import axios from 'axios';
import { MaterialIcons } from '@expo/vector-icons';

const DirectionsButton = ({ location, searchedLocation, setRouteCoordinates }) => {
  const [loading, setLoading] = useState(false);
  const openRouteServiceApiKey = process.env.OpenRouteServiceApi_Key;

  const getDirections = async () => {
    if (!location || !searchedLocation) {
      Alert.alert('Error', 'Both current location and destination must be set to get directions.');
      return;
    }

    setLoading(true);

    try {
      // Fetch directions with proper error handling and using the correct API format
      const response = await axios.post(
        `https://api.openrouteservice.org/v2/directions/driving-car`,
        {
          coordinates: [
            [location.coords.longitude, location.coords.latitude],
            [searchedLocation.longitude, searchedLocation.latitude],
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${openRouteServiceApiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.routes.length > 0) {
        const routeCoords = decodePolyline(response.data.routes[0].geometry);
        setRouteCoordinates(routeCoords);
      } else {
        Alert.alert('Error', 'No directions found for the specified locations.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch directions. Please check your internet connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const decodePolyline = (geometry) => {
    const coords = [];
    let index = 0, len = geometry.length;
    let lat = 0, lon = 0;

    while (index < len) {
      let b, shift = 0, result = 0;
      do {
        b = geometry.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const deltaLat = ((result & 1) ? ~(result >> 1) : (result >> 1));
      lat += deltaLat;

      shift = 0;
      result = 0;
      do {
        b = geometry.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const deltaLon = ((result & 1) ? ~(result >> 1) : (result >> 1));
      lon += deltaLon;

      coords.push({
        latitude: lat / 1e5,
        longitude: lon / 1e5,
      });
    }

    return coords;
  };

  return (
    <View style={styles.buttonContainer}>
      <TouchableOpacity style={styles.directionsButton} onPress={getDirections} disabled={loading}>
        {loading ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <>
            <MaterialIcons name="directions" size={24} color="white" />
            <Text style={styles.buttonText}>Get Directions</Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    position: 'absolute',
    bottom: 30,
    width: '90%',
    alignSelf: 'center',
    paddingVertical: 10,
  },
  directionsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6C63FF',
    padding: 12,
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  buttonText: {
    marginLeft: 10,
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default DirectionsButton;
