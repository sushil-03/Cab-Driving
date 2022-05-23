import tw from "tailwind-styled-components/dist/tailwind";
import { useEffect } from "react";
import Map from "./component/Map";
import Link from "next/link";
export default function Home() {
  return (
    <Wrapper>
      <Map id="map"></Map>
      <ActionItems>
        {/* Header Section */}
        <Header>
          <Logo>Logo</Logo>
          <Profile>
            <Name>Sushil Rawat</Name>
            <UserImage src="/me.jpg" />
          </Profile>
        </Header>

        {/* Action Section */}
        <ActionButtons>
          <Link href="/search">
            <ActionButton>
              <ActionButtonImage src="/bike.png" />
              Ride
            </ActionButton>
          </Link>
          <ActionButton>
            <ActionButtonImage src="/bike.png" />
            Wheels
          </ActionButton>
          <ActionButton>
            <ActionButtonImage src="/bike.png" />
            Booking
          </ActionButton>
        </ActionButtons>
        {/* Input Section */}
        <InputButton>Where to?</InputButton>
      </ActionItems>
    </Wrapper>
  );
}

const InputButton = tw.div`
  text-2xl h-20 bg-gray-200 m-3  mt-4 p-4 rounded-xl flex items-center
`;
// Input Section
const ActionButtonImage = tw.img`
h-3/5`;
const ActionButtons = tw.div`
flex gap-3 mx-5
`;
const ActionButton = tw.div`
h-32
border bg-gray-200
flex-1
flex
rounded-xl 
items-center justify-center
flex-col
text-lg
transform
hover:scale-105 transition
`;
// ActionButton

const Wrapper = tw.div`
  flex flex-col
  h-screen
`;

const ActionItems = tw.div`
flex-1
`;
const Logo = tw.div`text-bold text-5xl
`;
const Header = tw.div`
 p-6
 flex justify-between
 items-center
`;

const Profile = tw.div`
flex gap-4  items-center
`;
const Name = tw.div`
font-semibold text-xl
`;
const UserImage = tw.img`
h-20 w-20 rounded-full border border-gray-300 p-1`;
