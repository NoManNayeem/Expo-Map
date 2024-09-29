import React, { forwardRef } from 'react';
import { StyleSheet, Alert } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { MaterialIcons } from '@expo/vector-icons';
import { View, Text } from 'react-native';

const MapComponent = forwardRef(({ location, searchedLocation, routeCoordinates }, mapRef) => {
  if (!location) {
    return (
      <View style={styles.errorContainer}>
        <MaterialIcons name="error" size={48} color="#FF6347" />
        <Text style={styles.errorText}>Location data is unavailable</Text>
      </View>
    );
  }

  return (
    <MapView
      ref={mapRef}
      style={styles.map}
      initialRegion={{
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }}
      showsUserLocation={true}
      showsCompass={true}
      showsMyLocationButton={false}
      loadingEnabled={true}  // Show loading spinner while map is rendering
    >
      {/* User Location Marker (Blue) */}
      <Marker
        coordinate={{
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        }}
        title="You are here"
        pinColor="blue"
      />

      {/* Searched Location Marker (Red) */}
      {searchedLocation && (
        <Marker
          coordinate={{
            latitude: searchedLocation.latitude,
            longitude: searchedLocation.longitude,
          }}
          title="Searched Location"
          pinColor="red"
        />
      )}

      {/* Polyline for route */}
      {routeCoordinates.length > 0 && (
        <Polyline
          coordinates={routeCoordinates}
          strokeWidth={4}
          strokeColor="#6C63FF"
          lineDashPattern={[10, 5]}
        />
      )}
    </MapView>
  );
});

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
  },
  errorText: {
    marginTop: 10,
    fontSize: 18,
    color: '#FF6347',
    textAlign: 'center',
  },
});

export default MapComponent;
