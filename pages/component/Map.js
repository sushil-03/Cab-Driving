import tw from "tailwind-styled-components/dist/tailwind";
import mapboxgl from "mapbox-gl";
import { useEffect } from "react";

mapboxgl.accessToken =
  "pk.eyJ1Ijoic3VzaGlsZSIsImEiOiJja3IyYjh2NW0waW1yMm5yeDEwamtveG52In0.CtiyE_hQWk3oCQdvhx46dw";

const Map = () => {
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: "map",
      // style: "mapbox://styles/mapbox/streets-v11",
      style: "mapbox://styles/drakosi/ckvcwq3rwdw4314o3i2ho8tph",
      center: [78.032188, 30.316496],
      zoom: 10,
    });
  });
  return <Wrapper id="map"></Wrapper>;
};

export default Map;
const Wrapper = tw.div`
    flex-1
`;
