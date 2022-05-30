import tw from "tailwind-styled-components/dist/tailwind";
import mapboxgl from "mapbox-gl";
import { useEffect } from "react";

mapboxgl.accessToken =
  "pk.eyJ1Ijoic3VzaGlsZSIsImEiOiJja3IyYjh2NW0waW1yMm5yeDEwamtveG52In0.CtiyE_hQWk3oCQdvhx46dw";

const Map = ({ pick, drop }) => {
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: "map",
      // style: "mapbox://styles/mapbox/streets-v11",
      style: "mapbox://styles/drakosi/ckvcwq3rwdw4314o3i2ho8tph",
      center: [78.032188, 30.316496],
      zoom: 5,
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
  }, [pick, drop]);

  const addToMap = (map, cord) => {
    const marker1 = new mapboxgl.Marker()
      .setLngLat([cord[0][0], cord[0][1]])
      .addTo(map);
  };
  return <Wrapper id="map"></Wrapper>;
};

export default Map;
const Wrapper = tw.div`
    flex-1
`;
