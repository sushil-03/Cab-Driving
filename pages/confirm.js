import { useEffect, useState } from "react";
import tw from "tailwind-styled-components/dist/tailwind";
import Link from "next/link";
import { useRouter } from "next/router";
import RideSelector from "../component/RideSelector";
import Map from "../component/Map";

const Confirm = () => {
  const router = useRouter();
  const [pick, setPick] = useState();
  const [drop, setDrop] = useState();
  const { pickup, dropoff, ride, book } = router.query;
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
    // fetchSeat();
    getPickUpCoordinates(pickup);
    getDropoffCoordinates(dropoff);
  }, [pickup, dropoff]);

  return (
    <Wrapper>
      <Link href="/search">
        <BackButton src="/left-arrow.png" onClick />
      </Link>
      <Map pick={pick} drop={drop}></Map>
      <RideContainer>
        <RideSelector pick={pick} drop={drop} ride={ride} book={book} />
      </RideContainer>
    </Wrapper>
  );
};

export default Confirm;

const BackButton = tw.img`
h-10 w-10 absolute text-black  z-20 m-2 font-bold ml-4 rounded-full bg-white p-2 shadow`;
const RideContainer = tw.div`
flex-1 flex flex-col  mt-2 mx-2
`;
const Wrapper = tw.div`
flex h-screen w-screen flex-col relative
`;
