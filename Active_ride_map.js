import React, { useState, useEffect } from 'react';
import MapView, { Polyline,  PROVIDER_GOOGLE, Marker  } from 'react-native-maps';
import { Image } from 'react-native';
import start from './assets/post.png';
import waypoint from './assets/stickman.png';
import end from './assets/post_ride_end.png';
















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





const MapWithPolyline = ({ polylineCoordinates,  startMarkerCoord, endMarkerCoord, waypointsCoord}) => {
  const [region, setRegion] = useState(null);

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
      latitudeDelta: deltaLat + 0.05, // Add some padding
      longitudeDelta: deltaLng + 0.05, // Add some padding
    };
  };
  

  useEffect(() => {
    if (polylineCoordinates.length > 0) {
      setRegion(calculateRegion(polylineCoordinates));
    }
    console.log("start coordiante", startMarkerCoord);
    console.log("end coordinate", endMarkerCoord);
  }, [polylineCoordinates]);




  return (
    <MapView
      style={{ flex: 1 }}
      region={region}
      provider={PROVIDER_GOOGLE}
    >
      <Polyline
        coordinates={polylineCoordinates}
        strokeColor="#000" // Black color for the polyline
        strokeWidth={3} // Polyline width
      />
      {createMapMarkers([startMarkerCoord], start)}
      {createMapMarkers(waypointsCoord, waypoint)}
      {createMapMarkers([endMarkerCoord], end)}
    </MapView>
  );
};

export default MapWithPolyline;
