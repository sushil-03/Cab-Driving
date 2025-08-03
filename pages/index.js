import tw from "tailwind-styled-components/dist/tailwind";
import { useEffect, useState } from "react";
import Map from "../component/Map";
import Link from "next/link";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/router";
import Image from "next/image";
export default function Home() {
  const router = useRouter();
  const [myuser, setUser] = useState(null);
  const [booking, setBooking] = useState(false);
  const [date, setDate] = useState();
  useEffect(() => {
    return onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser({
          name: user.displayName,
          photoUrl: user.photoURL,
        });
      } else {
        setUser({
          name: "Tetsting",
          photoUrl:"/bike.png"
        });
        // router.push("/login");
      }
    });
  }, [router]);
  return (
    <Wrapper>
      <Map id="map"></Map>
      <ActionItems>
        {/* Header Section */}
        <Header>
          <Logo>Pahiya</Logo>
          <Profile>
            <Name>{myuser && myuser.name}</Name>
            <UserImage
              src={myuser && myuser.photoUrl}
              onClick={() => signOut(auth)}
            />
          </Profile>
        </Header>

        {/* Action Section */}
        <ActionButtons>
          <Link href={`/search?ride=car${date ? `&book=${date}` : ""}`}>
            {/* <Link href="/confirm"> */}
            <ActionButton>
              <ActionButtonImage src="/car.png" />4 wheeler
            </ActionButton>
          </Link>
          <Link href={`/search?ride=bike${date ? `&book=${date}` : ""}`}>
            <ActionButton>
              <ActionButtonImage src="/bike.png" />2 wheeler
            </ActionButton>
          </Link>

          <div
            className={`h-32
          border 
          flex-1
          flex 
          rounded-xl 
          items-center justify-center
          flex-col
          text-lg
          transform scal
          hover:scale-95 transition ${
            date ? "bg-blue-400  " : "bg-gray-200 pt-4"
          } `}
            onClick={() => setDate(0)}
          >
            <Image src="/cal.png" alt="" width={40} height={45} />
            <p>Booking</p>
            <input
              type="date"
              id="start"
              name="book"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={
                date ? "bg-blue-400  border p-1" : "bg-gray-200 pt-4 border p-1"
              }
            />
          </div>
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
hover:scale-90 transition

`;
// ActionButton

const Wrapper = tw.div`
  flex flex-col
  h-screen
`;

const ActionItems = tw.div`
flex-1
`;
const Logo = tw.div`text-bold text-5xl p-2
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
h-20 w-20 rounded-full border border-gray-300 p-1 cursor-pointer`;
