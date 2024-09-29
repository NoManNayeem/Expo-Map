import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, StatusBar, Alert, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import MapComponent from './components/MapComponent';
import SearchBar from './components/SearchBar';
import DirectionsButton from './components/DirectionsButton';
import { MaterialIcons } from '@expo/vector-icons';

export default function App() {
  const [location, setLocation] = useState(null);
  const [previousLocation, setPreviousLocation] = useState(null);
  const [searchedLocation, setSearchedLocation] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [loadingLocation, setLoadingLocation] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const mapRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          setLoadingLocation(false);
          return;
        }

        const currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation);
        setPreviousLocation(currentLocation);
      } catch (error) {
        if (previousLocation) {
          setLocation(previousLocation);
          Alert.alert('Info', 'Using your previous location.');
        } else {
          setErrorMsg('Unable to fetch location and no previous location found');
        }
      } finally {
        setLoadingLocation(false);
      }
    })();
  }, []);

  const recenterMapOnUser = () => {
    if (mapRef.current && location) {
      mapRef.current.animateToRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    } else {
      Alert.alert('Error', 'Current location is not available or map reference is invalid.');
    }
  };

  const recenterMapOnSearch = () => {
    if (mapRef.current && searchedLocation) {
      mapRef.current.animateToRegion({
        latitude: searchedLocation.latitude,
        longitude: searchedLocation.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  };

  if (loadingLocation) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6C63FF" />
        <Text style={styles.loadingText}>Fetching Location...</Text>
      </View>
    );
  }

  if (errorMsg) {
    return (
      <View style={styles.errorContainer}>
        <MaterialIcons name="error" size={48} color="#FF6347" />
        <Text style={styles.errorText}>{errorMsg}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <MapComponent
        ref={mapRef}
        location={location}
        searchedLocation={searchedLocation}
        routeCoordinates={routeCoordinates}
      />
      <SearchBar
        setSearchedLocation={(newLocation) => {
          setSearchedLocation(newLocation);
          recenterMapOnSearch();
        }}
      />
      {searchedLocation && (
        <DirectionsButton
          location={location}
          searchedLocation={searchedLocation}
          setRouteCoordinates={setRouteCoordinates}
        />
      )}
      <TouchableOpacity
        style={styles.locationButton}
        onPress={recenterMapOnUser}
      >
        <MaterialIcons name="my-location" size={28} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
  },
  loadingText: {
    marginTop: 15,
    fontSize: 18,
    fontWeight: '500',
    color: '#6C63FF',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
  },
  errorText: {
    marginTop: 15,
    fontSize: 18,
    fontWeight: '500',
    color: '#FF6347',
  },
  locationButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#6C63FF',
    padding: 12,
    borderRadius: 50,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
  },
});

