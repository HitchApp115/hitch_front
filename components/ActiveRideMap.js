import React, { useState, useEffect } from 'react';
import MapView, { Polyline,  PROVIDER_GOOGLE, Marker  } from 'react-native-maps';
import { Image } from 'react-native';
import start from '../assets/post.png';
import waypoint from '../assets/hitchHiker2.png';
import end from '../assets/post_ride_end.png';

const RetroMapStyle = [
  { "elementType": "geometry", "stylers": [{ "color": "#ebe3cd" }] },
  { "elementType": "labels.text.fill", "stylers": [{ "color": "#523735" }] },
  { "elementType": "labels.text.stroke", "stylers": [{ "color": "#f5f1e6" }] },
  {
    "featureType": "administrative",
    "elementType": "geometry.stroke",
    "stylers": [{ "color": "#c9b2a6" }]
  },
  {
    "featureType": "administrative.land_parcel",
    "elementType": "geometry.stroke",
    "stylers": [{ "color": "#dcd2be" }]
  },
  {
    "featureType": "administrative.land_parcel",
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#ae9e90" }]
  },
  {
    "featureType": "landscape.natural",
    "elementType": "geometry",
    "stylers": [{ "color": "#dfd2ae" }]
  },
  {
    "featureType": "poi",
    "elementType": "geometry",
    "stylers": [{ "color": "#dfd2ae" }]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#93817c" }]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry.fill",
    "stylers": [{ "color": "#a5b076" }]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#447530" }]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [{ "color": "#f5f1e6" }]
  },
  {
    "featureType": "road.arterial",
    "elementType": "geometry",
    "stylers": [{ "color": "#fdfcf8" }]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [{ "color": "#f8c967" }]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry.stroke",
    "stylers": [{ "color": "#e9bc62" }]
  },
  {
    "featureType": "road.highway.controlled_access",
    "elementType": "geometry",
    "stylers": [{ "color": "#e98d58" }]
  },
  {
    "featureType": "road.highway.controlled_access",
    "elementType": "geometry.stroke",
    "stylers": [{ "color": "#db8555" }]
  },
  {
    "featureType": "road.local",
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#806b63" }]
  },
  {
    "featureType": "transit.line",
    "elementType": "geometry",
    "stylers": [{ "color": "#dfd2ae" }]
  },
  {
    "featureType": "transit.line",
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#8f7d77" }]
  },
  {
    "featureType": "transit.line",
    "elementType": "labels.text.stroke",
    "stylers": [{ "color": "#ebe3cd" }]
  },
  {
    "featureType": "transit.station",
    "elementType": "geometry",
    "stylers": [{ "color": "#dfd2ae" }]
  },
  {
    "featureType": "water",
    "elementType": "geometry.fill",
    "stylers": [{ "color": "#b9d3c2" }]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#92998d" }]
  }
];

const createMapMarkers = (coordinatesArray, markerImage) => {

  // Check if coordinatesArray is provided and is an array
  if (Array.isArray(coordinatesArray) && coordinatesArray.length > 0) {
    return coordinatesArray.map((coordinates, index) => {
      // Check if the individual coordinates object is valid
      if (coordinates && coordinates.latitude && coordinates.longitude) {
        return (
          <Marker
            key={index}
            coordinate={{
              latitude: coordinates.latitude,
              longitude: coordinates.longitude,
            }}
            // Additional Marker properties can be added here
          >
            <Image
              source={markerImage}
              style={{ width: 50, height: 50, zIndex: 200 }} // You can adjust the size as needed
            />
          </Marker>

        );
      }
      return null;
    });
  }

  // Return null or an alternative element if coordinatesArray is not valid
  return null;
};

const MapWithPolyline = ({ polylineCoordinates,  startMarkerCoord, endMarkerCoord, waypointsCoord, extraStyle = {}}) => {
  const [region, setRegion] = useState(null);

  useEffect(() => {
    if (polylineCoordinates.length > 0) {
      setRegion(calculateRegion(polylineCoordinates));
    }
  }, [polylineCoordinates]);


  const calculateRegion = (coords) => {
    let minLat, maxLat, minLng, maxLng;

    // Get min and max latitude/longitude to encompass all points
    coords.forEach((coord) => {
      minLat = minLat < coord.latitude ? minLat : coord.latitude;
      maxLat = maxLat > coord.latitude ? maxLat : coord.latitude;
      minLng = minLng < coord.longitude ? minLng : coord.longitude;
      maxLng = maxLng > coord.longitude ? maxLng : coord.longitude;
    });

    const midLat = (minLat + maxLat) / 2;
    const midLng = (minLng + maxLng) / 2;
    const deltaLat = maxLat - minLat;
    const deltaLng = maxLng - minLng;

    return {
      latitude: midLat,
      longitude: midLng,
      latitudeDelta: deltaLat + 0.02, // Add some padding
      longitudeDelta: deltaLng + 0.02, // Add some padding
    };
  };
  
  return (
    <MapView
      style={{ flex: 1, ...extraStyle }}
      region={region}
      customMapStyle={RetroMapStyle}
      provider={PROVIDER_GOOGLE}
      showsUserLocation={true}
    >
      <Polyline
        coordinates={polylineCoordinates}
        strokeColor="#000" // Black color for the polyline
        strokeWidth={4} // Polyline width
      />
      {createMapMarkers([startMarkerCoord], start)}
      {createMapMarkers(waypointsCoord, waypoint)}
      {createMapMarkers([endMarkerCoord], end)}
    </MapView>
  );
};

export default MapWithPolyline;
