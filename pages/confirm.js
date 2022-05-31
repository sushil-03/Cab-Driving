import { useEffect, useState } from "react";
import tw from "tailwind-styled-components/dist/tailwind";
import Map from "./component/Map";
import { useRouter } from "next/router";
import RideSelector from "./component/RideSelector";
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
      <RideContainer>
        <RideSelector />
        <ConfirmButtonContainer>
          <ConfirmButton>Confirm Travel</ConfirmButton>
        </ConfirmButtonContainer>
      </RideContainer>
    </Wrapper>
  );
};

export default Confirm;
const ConfirmButtonContainer = tw.div`
border-t-2`;
const RideContainer = tw.div`
flex-1 flex flex-col
`;
const Wrapper = tw.div`
flex h-screen w-screen flex-col
`;
const ConfirmButton = tw.div` bg-black text-white text-center text-xl py-3 m-4 rounded  border-t-2 border-gray-600`;
