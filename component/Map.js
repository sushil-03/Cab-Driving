import tw from "tailwind-styled-components/dist/tailwind";
import mapboxgl from "mapbox-gl";
import { useEffect, useState } from "react";

const Map = ({ pick, drop }) => {
  const [mapError, setMapError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let map;
    let loadingTimeout;

    const initializeMap = () => {
      try {
        if (mapboxgl && typeof window !== 'undefined') {
          mapboxgl.accessToken =
            "pk.eyJ1Ijoic3VzaGlsZSIsImEiOiJja3IyYjh2NW0waW1yMm5yeDEwamtveG52In0.CtiyE_hQWk3oCQdvhx46dw";

          map = new mapboxgl.Map({
            container: "map",
            style: "mapbox://styles/mapbox/streets-v11", // Back to standard streets style
            center: [78.032188, 30.316496],
            zoom: 14,
            attributionControl: false,
          });

          // Set a timeout to hide loading after 3 seconds regardless
          loadingTimeout = setTimeout(() => {
            setIsLoading(false);
          }, 3000);

          // Add error handling for map load
          map.on('error', (e) => {
            console.warn('Map error:', e);
            setIsLoading(false);
          });

          map.on('load', () => {
            clearTimeout(loadingTimeout);
            setIsLoading(false);
            setMapError(false);
          });

          map.on('idle', () => {
            // Map has finished loading and rendering
            setIsLoading(false);
          });

          if (pick) {
            addToMap(map, pick);
          }
          if (drop) {
            addToMap(map, drop);
          }
          if (pick && drop) {
            map.fitBounds([pick[0], drop[0]], {
              padding: 60,
            });
          }

          map.scrollZoom.enable();
          const nav = new mapboxgl.NavigationControl();
          map.addControl(nav);
        }
      } catch (error) {
        console.error('Error initializing map:', error);
        setMapError(true);
        setIsLoading(false);
      }
    };

    // Small delay to ensure DOM is ready
    const initTimeout = setTimeout(initializeMap, 100);

    // Cleanup function
    return () => {
      clearTimeout(initTimeout);
      clearTimeout(loadingTimeout);
      if (map) {
        map.remove();
      }
    };
  }, [pick, drop]);

  const addToMap = (map, cord) => {
    if (mapboxgl) {
      new mapboxgl.Marker().setLngLat([cord[0][0], cord[0][1]]).addTo(map);
    }
  };

  if (mapError) {
    return (
      <ErrorWrapper>
        <ErrorContent>
          <ErrorIcon>🗺️</ErrorIcon>
          <ErrorTitle>Map Unavailable</ErrorTitle>
          <ErrorMessage>Unable to load map. Please check your connection.</ErrorMessage>
          <RetryButton onClick={() => window.location.reload()}>
            Retry
          </RetryButton>
        </ErrorContent>
      </ErrorWrapper>
    );
  }

  return (
    <Wrapper>
      {isLoading && (
        <LoadingOverlay>
          <LoadingSpinner />
          <LoadingText>Loading map...</LoadingText>
        </LoadingOverlay>
      )}
      <MapContainer id="map" />
    </Wrapper>
  );
};

export default Map;

const Wrapper = tw.div`
  flex-1 relative min-h-0
`;

const MapContainer = tw.div`
  w-full h-full min-h-full
`;

const LoadingOverlay = tw.div`
  absolute inset-0 bg-gray-100
  flex flex-col items-center justify-center
  z-10
`;

const LoadingSpinner = tw.div`
  w-8 h-8 border-4 border-blue-500 border-t-transparent
  rounded-full animate-spin mb-2
`;

const LoadingText = tw.p`
  text-gray-600 font-medium
`;

const ErrorWrapper = tw.div`
  flex-1 bg-gray-100
  flex items-center justify-center
  p-8
`;

const ErrorContent = tw.div`
  text-center space-y-4
  max-w-sm
`;

const ErrorIcon = tw.div`
  text-6xl mb-4
`;

const ErrorTitle = tw.h3`
  text-xl font-semibold text-gray-800
`;

const ErrorMessage = tw.p`
  text-gray-600
`;

const RetryButton = tw.button`
  bg-blue-600 text-white px-6 py-2
  rounded-lg font-medium
  transition-colors duration-200
`;
