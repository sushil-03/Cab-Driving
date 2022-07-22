import tw from "tailwind-styled-components/dist/tailwind";
import mapboxgl from "mapbox-gl";
import { useEffect } from "react";

const Map = ({ pick, drop }) => {
  useEffect(() => {
    if (mapboxgl) {
      mapboxgl.accessToken =
        "pk.eyJ1Ijoic3VzaGlsZSIsImEiOiJja3IyYjh2NW0waW1yMm5yeDEwamtveG52In0.CtiyE_hQWk3oCQdvhx46dw";
      const map = new mapboxgl.Map({
        container: "map",
        // style: "mapbox://styles/mapbox/streets-v11",
        style: "mapbox://styles/drakosi/ckvcwq3rwdw4314o3i2ho8tph",
        center: [78.032188, 30.316496],
        zoom: 14,
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

      //Mapbox Direction
      // const directions = new MapboxDirections({
      //   accessToken: mapboxgl.accessToken,
      //   unit: "metric",
      //   profile: "mapbox/driving",
      //   alternatives: false,
      //   geometries: "geojson",
      //   controls: { instructions: false },
      //   flyTo: false,
      // });
      // map.addControl(directions, "top-right");
      map.scrollZoom.enable();
      const nav = new mapboxgl.NavigationControl();
      map.addControl(nav);
    }
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
