import tw from "tailwind-styled-components/dist/tailwind";
import mapboxgl from "mapbox-gl";
import { useEffect, useState } from "react";
import SimpleMap from "./SimpleMap";

const Map = ({ pick, drop }) => {
  const [mapError, setMapError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let map;
    let loadingTimeout;

    const initializeMap = () => {
      try {
        if (mapboxgl && typeof window !== 'undefined') {
          // Disable telemetry to prevent network errors
          mapboxgl.prewarm();
          mapboxgl.clearPrewarmedResources();

          mapboxgl.accessToken =
            "pk.eyJ1Ijoic3VzaGlsZSIsImEiOiJja3IyYjh2NW0waW1yMm5yeDEwamtveG52In0.CtiyE_hQWk3oCQdvhx46dw";

          map = new mapboxgl.Map({
            container: "map",
            style: "mapbox://styles/mapbox/streets-v11",
            center: [78.032188, 30.316496],
            zoom: 14,
            attributionControl: false,
            logoPosition: 'bottom-right',
            refreshExpiredTiles: false,
            maxTileCacheSize: null,
            transformRequest: (url, resourceType) => {
              // Handle CORS and network issues
              if (resourceType === 'Tile' && url.startsWith('https://api.mapbox.com')) {
                return {
                  url: url,
                  headers: {},
                  credentials: 'omit'
                };
              }
              return { url };
            }
          });

          // Set a timeout to hide loading after 3 seconds regardless
          loadingTimeout = setTimeout(() => {
            setIsLoading(false);
          }, 3000);

          // Add error handling for map load
          map.on('error', (e) => {
            console.warn('Map error:', e);
            setMapError(true);
            setIsLoading(false);
          });

          map.on('load', () => {
            clearTimeout(loadingTimeout);
            setIsLoading(false);
            setMapError(false);

            // Add route layer after map loads
            if (pick && drop) {
              addRouteToMap(map, pick, drop);
            }
          });

          map.on('idle', () => {
            // Map has finished loading and rendering
            setIsLoading(false);
          });

          // Add markers for pickup and dropoff
          if (pick) {
            addPickupMarker(map, pick);
          }
          if (drop) {
            addDropoffMarker(map, drop);
          }

          // Fit bounds to show both points
          if (pick && drop) {
            const bounds = new mapboxgl.LngLatBounds()
              .extend(pick[0])
              .extend(drop[0]);
            map.fitBounds(bounds, {
              padding: 80,
              maxZoom: 15
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

  const addPickupMarker = (map, coordinates) => {
    if (mapboxgl && coordinates) {
      // Create custom pickup marker element
      const pickupElement = document.createElement('div');
      pickupElement.className = 'pickup-marker';
      pickupElement.style.cssText = `
        width: 30px;
        height: 30px;
        background: #10b981;
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        color: white;
        font-weight: bold;
      `;
      pickupElement.innerHTML = '🚗';

      new mapboxgl.Marker(pickupElement)
        .setLngLat([coordinates[0][0], coordinates[0][1]])
        .addTo(map);
    }
  };

  const addDropoffMarker = (map, coordinates) => {
    if (mapboxgl && coordinates) {
      // Create custom dropoff marker element
      const dropoffElement = document.createElement('div');
      dropoffElement.className = 'dropoff-marker';
      dropoffElement.style.cssText = `
        width: 30px;
        height: 30px;
        background: #ef4444;
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        color: white;
        font-weight: bold;
      `;
      dropoffElement.innerHTML = '📍';

      new mapboxgl.Marker(dropoffElement)
        .setLngLat([coordinates[0][0], coordinates[0][1]])
        .addTo(map);
    }
  };

  const addRouteToMap = async (map, pickup, dropoff) => {
    if (!pickup || !dropoff || !map || map._removed) return;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${pickup[0][0]},${pickup[0][1]};${dropoff[0][0]},${dropoff[0][1]}?` +
        new URLSearchParams({
          access_token: mapboxgl.accessToken,
          geometries: 'geojson',
          overview: 'full',
          steps: true
        }),
        {
          signal: controller.signal,
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.routes && data.routes[0]) {
        const route = data.routes[0].geometry;

        // Remove existing route layer if it exists
        if (map.getLayer('route')) {
          map.removeLayer('route');
        }
        if (map.getSource('route')) {
          map.removeSource('route');
        }

        // Add route source
        map.addSource('route', {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: route
          }
        });

        // Add route layer with animated style
        map.addLayer({
          id: 'route',
          type: 'line',
          source: 'route',
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#3b82f6',
            'line-width': [
              'interpolate',
              ['linear'],
              ['zoom'],
              10, 3,
              18, 8
            ],
            'line-opacity': 0.8
          }
        });

        // Add route outline for better visibility
        map.addLayer({
          id: 'route-outline',
          type: 'line',
          source: 'route',
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#1e40af',
            'line-width': [
              'interpolate',
              ['linear'],
              ['zoom'],
              10, 5,
              18, 12
            ],
            'line-opacity': 0.4
          }
        }, 'route'); // Add below the main route layer

        // Add animated dots along the route
        const animateRoute = () => {
          const coordinates = route.coordinates;
          if (coordinates.length < 2 || !map) return;

          // Create animated marker that moves along the route
          const animationDuration = 3000; // 3 seconds
          let start = null;
          let animationId = null;

          const animate = (timestamp) => {
            // Check if map still exists
            if (!map || map._removed) {
              if (animationId) {
                cancelAnimationFrame(animationId);
              }
              return;
            }

            if (!start) start = timestamp;
            const progress = Math.min((timestamp - start) / animationDuration, 1);

            // Calculate position along route
            const totalPoints = coordinates.length;
            const currentIndex = Math.floor(progress * (totalPoints - 1));

            if (currentIndex < totalPoints - 1) {
              const currentPoint = coordinates[currentIndex];
              const nextPoint = coordinates[currentIndex + 1];
              const segmentProgress = (progress * (totalPoints - 1)) - currentIndex;

              // Interpolate between current and next point
              const lng = currentPoint[0] + (nextPoint[0] - currentPoint[0]) * segmentProgress;
              const lat = currentPoint[1] + (nextPoint[1] - currentPoint[1]) * segmentProgress;

              // Update moving marker if it exists and map is still valid
              try {
                const movingMarker = map.getSource('moving-point');
                if (movingMarker && map.isStyleLoaded()) {
                  movingMarker.setData({
                    type: 'Feature',
                    geometry: {
                      type: 'Point',
                      coordinates: [lng, lat]
                    }
                  });
                }
              } catch (error) {
                console.warn('Animation error:', error);
                if (animationId) {
                  cancelAnimationFrame(animationId);
                }
                return;
              }
            }

            if (progress < 1 && map && !map._removed) {
              animationId = requestAnimationFrame(animate);
            } else if (map && !map._removed) {
              // Restart animation
              setTimeout(() => {
                if (map && !map._removed) {
                  start = null;
                  animationId = requestAnimationFrame(animate);
                }
              }, 1000);
            }
          };

          // Add moving point source and layer
          try {
            if (map && !map.getSource('moving-point') && map.isStyleLoaded()) {
              map.addSource('moving-point', {
                type: 'geojson',
                data: {
                  type: 'Feature',
                  geometry: {
                    type: 'Point',
                    coordinates: coordinates[0]
                  }
                }
              });

              map.addLayer({
                id: 'moving-point',
                type: 'circle',
                source: 'moving-point',
                paint: {
                  'circle-radius': 6,
                  'circle-color': '#ffffff',
                  'circle-stroke-color': '#3b82f6',
                  'circle-stroke-width': 3,
                  'circle-opacity': 0.9
                }
              });

              animationId = requestAnimationFrame(animate);
            }
          } catch (error) {
            console.warn('Error adding animation:', error);
          }
        };

        // Start animation after a short delay
        setTimeout(animateRoute, 500);
      }
    } catch (error) {
      console.error('Error fetching route:', error);
      // Fallback: draw straight line between points
      addStraightLineRoute(map, pickup, dropoff);
    }
  };

  const addStraightLineRoute = (map, pickup, dropoff) => {
    const lineData = {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: [
          [pickup[0][0], pickup[0][1]],
          [dropoff[0][0], dropoff[0][1]]
        ]
      }
    };

    if (map.getSource('fallback-route')) {
      map.getSource('fallback-route').setData(lineData);
    } else {
      map.addSource('fallback-route', {
        type: 'geojson',
        data: lineData
      });

      map.addLayer({
        id: 'fallback-route',
        type: 'line',
        source: 'fallback-route',
        paint: {
          'line-color': '#94a3b8',
          'line-width': 3,
          'line-dasharray': [2, 4],
          'line-opacity': 0.7
        }
      });
    }
  };

  if (mapError) {
    return <SimpleMap pick={pick} drop={drop} />;
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

const FallbackMap = tw.div`
  flex-1 p-4
`;
