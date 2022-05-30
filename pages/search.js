import tw from "tailwind-styled-components/dist/tailwind";
import { useRouter } from "next/router";
import Link from "next/link";
import { useState, useEffect } from "react";
const Search = () => {
  const router = useRouter();
  const [pickup, setPickUp] = useState("");
  const [dropoff, setDropoff] = useState("");
  const handleBack = () => {
    router.push("/");
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
        <PlusIcon>+</PlusIcon>
      </InputContainer>
      <SavedPlaces>
        <StarIcon src="/star.png" />
        Saved Places
      </SavedPlaces>
      <Link
        href={{
          pathname: "/confirm",
          query: { pickup: pickup, dropoff: dropoff },
        }}
      >
        <Button>Confirm Locations</Button>
      </Link>
    </Wrapper>
  );
};

export default Search;
const Button = tw.button`bg-black w-4/5 mx-14 my-2 p-4 text-white text-xl overflow-hidden`;
const StarIcon = tw.img`w-10 h-10 p-2 bg-gray-400 rounded-full`;
const SavedPlaces = tw.div`flex items-center bg-white gap-2 font-semibold p-4 mt-2`;
const PlusIcon = tw.div` text-5xl  bg-gray-200 font-extralight w-14 h-14 text-center rounded-full`;
const InputBoxes = tw.div`
flex flex-col gap-8 flex-1
`;
const Input = tw.input`
h-10  bg-gray-300  p-2 outline-none rounded 
 `;
const InputContainer = tw.div`
bg-white flex gap-4 p-2 items-center
`;
const FromToIcons = tw.div`
flex gap-2 flex-col justify-center ml-2 item-center`;

const Circle = tw.div` h-4 w-4 rounded-full bg-gray-500`;
const Line = tw.div`h-14 w-1 bg-gray-600 ml-1.5`;
const Square = tw.div`h-4 w-4 bg-black `;
const Wrapper = tw.div`
    bg-gray-200 h-screen 
`;
const ButtonContainer = tw.div`
bg-white
`;
const BackButton = tw.img`
h-10  px-4 py-2 block `;
