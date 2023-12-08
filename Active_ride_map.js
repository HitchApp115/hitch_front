import React, { useState, useEffect } from 'react';
import MapView, { Polyline,  PROVIDER_GOOGLE, Marker  } from 'react-native-maps';
import { Image } from 'react-native';
import start from './assets/post.png';
// import waypoint from './assets/stickman.png';
import waypoint from './assets/hitchHiker2.png';


import end from './assets/post_ride_end.png';






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

const NightMapStyle = [
  { "elementType": "geometry", "stylers": [{ "color": "#242f3e" }] },
  { "elementType": "labels.text.stroke", "stylers": [{ "color": "#242f3e" }] },
  { "elementType": "labels.text.fill", "stylers": [{ "color": "#746855" }] },
  {
    "featureType": "administrative.locality",
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#d59563" }]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#d59563" }]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [{ "color": "#263c3f" }]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#6b9a76" }]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [{ "color": "#38414e" }]
  },
  {
    "featureType": "road",
    "elementType": "geometry.stroke",
    "stylers": [{ "color": "#212a37" }]
  },
  {
    "featureType": "road",
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#9ca5b3" }]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [{ "color": "#746855" }]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry.stroke",
    "stylers": [{ "color": "#1f2835" }]
  },
  {
    "featureType": "road.highway",
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#f3d19c" }]
  },
  {
    "featureType": "transit",
    "elementType": "geometry",
    "stylers": [{ "color": "#2f3948" }]
  },
  {
    "featureType": "transit.station",
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#d59563" }]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [{ "color": "#17263c" }]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#515c6d" }]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.stroke",
    "stylers": [{ "color": "#17263c" }]
  }
];


const medievalMapStyle = 
[
  {
    "elementType": "geometry",
    "stylers": [
      { "color": "#eae0d6" } // Parchment-like background for an old-world feel
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      { "color": "#523735" } // Dark brown text, reminiscent of ink
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      { "color": "#f5f1e6" } // Light stroke for contrast
    ]
  },
  {
    "featureType": "administrative",
    "elementType": "geometry.stroke",
    "stylers": [
      { "color": "#c9b2a6" } // Subdued borders for a vintage look
    ]
  },
  {
    "featureType": "landscape",
    "elementType": "geometry",
    "stylers": [
      { "color": "#b7d2a8" } // Muted green for natural areas
    ]
  },
  {
    "featureType": "poi",
    "elementType": "geometry",
    "stylers": [
      { "color": "#d2e3d1" } // Soft green for points of interest
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry.fill",
    "stylers": [
      { "color": "#a6cfa5" } // Deeper green for parks
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [
      { "color": "#e9e0da" } // Lighter road color for a dusty, unpaved look
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "geometry",
    "stylers": [
      { "color": "#dcd4c4" } // Neutral tones for larger roads
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      { "color": "#e6d8c3" } // Beige highways, resembling old stone paths
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry.fill",
    "stylers": [
      { "color": "#b0d0d3" } // Soft blue for water bodies
    ]
  }
];



const cartoonMapStyle = [
  {
    "elementType": "geometry",
    "stylers": [
      { "color": "#B0A695" }, // Light blue for the base map background
      // {"color": "#ebe3cd"}
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      { "color": "#586369" } // Dark gray for text
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      { "color": "#ffffff" } // White background for text for readability
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "elementType": "labels.text.fill",
    "stylers": [
      { "color": "#ae9e90" } // Soft brown for land parcel labels
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [
      { "color": "#fdfcf8" } // Very light color for roads
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry.stroke",
    "stylers": [
      { "color": "#d6d6d6" } // Light grey for road outlines
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry.fill",
    "stylers": [
      { "color": "#a2daf2" } // Bright blue for water bodies
    ]
  },
  // Additional custom styles can be added here for a more playful, cartoonish look
];

const BlackAndWhiteMapStyle = [
  {
    "elementType": "geometry",
    "stylers": [{ "color": "#f5f5f5" }]
  },
  {
    "elementType": "labels.icon",
    "stylers": [{ "visibility": "off" }]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#616161" }]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [{ "color": "#f5f5f5" }]
  },
  {
    "featureType": "administrative.land_parcel",
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#bdbdbd" }]
  },
  {
    "featureType": "poi",
    "elementType": "geometry",
    "stylers": [{ "color": "#eeeeee" }]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#757575" }]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [{ "color": "#e5e5e5" }]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#9e9e9e" }]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [{ "color": "#ffffff" }]
  },
  {
    "featureType": "road.arterial",
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#757575" }]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [{ "color": "#dadada" }]
  },
  {
    "featureType": "road.highway",
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#616161" }]
  },
  {
    "featureType": "road.local",
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#9e9e9e" }]}];



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
      latitudeDelta: deltaLat + 0.02, // Add some padding
      longitudeDelta: deltaLng + 0.02, // Add some padding
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
