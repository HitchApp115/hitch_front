import React, { useState, useEffect } from 'react';
import MapView, { Polyline,  PROVIDER_GOOGLE,   } from 'react-native-maps';

const MapWithPolyline = ({ polylineCoordinates }) => {
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
    </MapView>
  );
};

export default MapWithPolyline;
