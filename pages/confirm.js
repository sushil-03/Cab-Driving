import { useEffect, useState } from "react";
import tw from "tailwind-styled-components/dist/tailwind";
import Map from "./component/Map";
import { useRouter } from "next/router";
const Confirm = () => {
  const router = useRouter();
  const [pick, setPick] = useState();
  const [drop, setDrop] = useState();
  const { pickup, dropoff } = router.query;
  const getPickUpCoordinates = (pickup) => {
    fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${pickup}.json?` +
        new URLSearchParams({
          access_token:
            "pk.eyJ1Ijoic3VzaGlsZSIsImEiOiJja3IyYjh2NW0waW1yMm5yeDEwamtveG52In0.CtiyE_hQWk3oCQdvhx46dw",
          limit: 1,
        })
    )
      .then((response) => response.json())
      .then((data) => {
        setPick([data.features[0].center]);
      });
  };
  const getDropoffCoordinates = (dropoff) => {
    fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${dropoff}.json?` +
        new URLSearchParams({
          access_token:
            "pk.eyJ1Ijoic3VzaGlsZSIsImEiOiJja3IyYjh2NW0waW1yMm5yeDEwamtveG52In0.CtiyE_hQWk3oCQdvhx46dw",
          limit: 1,
        })
    )
      .then((response) => response.json())
      .then((data) => {
        setDrop([data.features[0].center]);
      });
  };
  useEffect(() => {
    getPickUpCoordinates(pickup);
    getDropoffCoordinates(dropoff);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pickup, dropoff]);

  return (
    <Wrapper>
      <Map pick={pick} drop={drop}></Map>
      <RideContainer></RideContainer>
    </Wrapper>
  );
};

export default Confirm;
const RideContainer = tw.div`
flex-1
`;
const Wrapper = tw.div`
flex h-screen w-screen flex-col
`;
