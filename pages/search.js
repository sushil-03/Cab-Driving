import tw from "tailwind-styled-components/dist/tailwind";
import { useRouter } from "next/router";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
const Search = () => {
  const router = useRouter();
  const [pickup, setPickUp] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [addtoFav, setAddtoFav] = useState(false);
  const [allFavLoc, setAllFavLoc] = useState();
  const handleBack = () => {
    router.push("/");
  };
  const { book, ride } = router.query;
  console.log(router.query);
  const Storagecall = () => {
    setAddtoFav(!addtoFav);
    // console.log("1");
    // if (pickup && dropoff) {
    //   console.log("2");
    //   setAddtoFav(true);
    //   console.log("3");
    //   let locations = [];
    //   locations = JSON.parse(localStorage.getItem("session")) || [];
    //   locations.push({
    //     pickup,
    //     dropoff,
    //   });
    //   setAllFavLoc(locations);
    //   localStorage.setItem("session", JSON.stringify(locations));
    //   setAddtoFav(true);
    // }
  };
  return (
    <Wrapper>
      <ButtonContainer>
        <BackButton src="/left-arrow.png" onClick={handleBack} />
      </ButtonContainer>
      <InputContainer>
        <FromToIcons>
          <Circle></Circle>
          <Line></Line>
          <Square></Square>
        </FromToIcons>
        <InputBoxes>
          <Input
            placeholder="Enter pickup location"
            value={pickup}
            onChange={(e) => setPickUp(e.target.value)}
          />
          <Input
            placeholder="Where to?"
            value={dropoff}
            onChange={(e) => setDropoff(e.target.value)}
          />
        </InputBoxes>
        <span
          className={`text-5xl  font-extralight w-14 h-14 text-center rounded-full cursor-pointer ${
            addtoFav ? `bg-blue-500 text-white` : `bg-gray-200`
          }`}
          onClick={() => Storagecall()}
        >
          +
        </span>
      </InputContainer>
      <SavedPlaces>
        <Image
          alt="s"
          src="/star.png"
          width={40}
          height={40}
          className="w-10 h-10 p-2 rounded-full bg-black"
        />
        <span>Saved Places</span>
      </SavedPlaces>
      <div>{allFavLoc && console.log(allFavLoc)}</div>
      <Link
        href={{
          pathname: "/confirm",
          query: { pickup: pickup, dropoff: dropoff, ride: ride, book },
        }}
      >
        <Button>Confirm Locations</Button>
      </Link>
    </Wrapper>
  );
};

export default Search;
const Button = tw.button`bg-black w-4/5 mx-14 my-2 p-4 text-white text-xl overflow-hidden`;

const SavedPlaces = tw.div`flex items-center bg-white gap-2 font-semibold p-4 mt-2`;
const PlusIcon = tw.div` text-5xl  bg-gray-200 font-extralight w-14 h-14 text-center rounded-full`;
const InputBoxes = tw.div`
flex flex-col gap-8 flex-1
`;
const Input = tw.input`
h-10  bg-gray-300  p-2 outline-none rounded border hover:border-blue-500`;
const InputContainer = tw.div`
bg-white flex gap-4 p-2 items-center
`;
const FromToIcons = tw.div`
flex gap-2 flex-col justify-center ml-2 item-center`;

const Circle = tw.div` h-4 w-4 rounded-full bg-gray-500`;
const Line = tw.div`h-14 w-1 bg-gray-600 ml-1.5`;
const Square = tw.div`h-4 w-4 bg-black `;
const Wrapper = tw.div` font-sans
    bg-gray-200 h-screen 
`;
const ButtonContainer = tw.div`
bg-white
`;
const BackButton = tw.img`
h-10  px-4 py-2 block `;
