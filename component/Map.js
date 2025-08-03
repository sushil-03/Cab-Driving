import tw from "tailwind-styled-components/dist/tailwind";
import mapboxgl from "mapbox-gl";
import { useEffect, useState } from "react";

const Map = ({ pick, drop }) => {
  const [mapError, setMapError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let map;

    const initializeMap = async () => {
      try {
        if (mapboxgl && typeof window !== 'undefined') {
          mapboxgl.accessToken =
            "pk.eyJ1Ijoic3VzaGlsZSIsImEiOiJja3IyYjh2NW0waW1yMm5yeDEwamtveG52In0.CtiyE_hQWk3oCQdvhx46dw";

          map = new mapboxgl.Map({
            container: "map",
            style: "mapbox://styles/mapbox/light-v11", // Using a more reliable built-in style
            center: [78.032188, 30.316496],
            zoom: 14,
            localIdeographFontFamily: false, // Disable local font loading to prevent font errors
          });

          // Add error handling for map load
          map.on('error', (e) => {
            console.warn('Map error:', e);
            setMapError(true);
          });

          map.on('load', () => {
            setIsLoading(false);
            setMapError(false);
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

    initializeMap();

    // Cleanup function
    return () => {
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

  return <Wrapper id="map"></Wrapper>;
};

export default Map;
const Wrapper = tw.div`
    flex-1
`;
