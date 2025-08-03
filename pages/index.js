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
  const [date, setDate] = useState("");
  const [currentLocation, setCurrentLocation] = useState("Getting location...");

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
          photoUrl: "/bike.png"
        });
        // router.push("/login");
      }
    });
  }, [router]);

  useEffect(() => {
    // Simulate getting current location
    setTimeout(() => {
      setCurrentLocation("Current Location");
    }, 2000);
  }, []);

  const quickBookingOptions = [
    { icon: "🏠", text: "Home", time: "5 min" },
    { icon: "🏢", text: "Office", time: "12 min" },
    { icon: "🏪", text: "Mall", time: "8 min" },
    { icon: "🏥", text: "Hospital", time: "15 min" }
  ];

  return (
    <AppContainer>
      <MapContainer>
        <Map id="map" />
        <MapOverlay>
          <LocationPinContainer>
            <LocationPin>📍</LocationPin>
            <LocationText>{currentLocation}</LocationText>
          </LocationPinContainer>
        </MapOverlay>
      </MapContainer>
      
      <BottomSheet>
        {/* Header Section */}
        <Header>
          <BrandSection>
            <Logo>Pahiya</Logo>
            <Tagline>Ride Smart, Arrive Safe</Tagline>
          </BrandSection>
          <UserProfile>
            <UserInfo>
              <UserName>Hi, {myuser?.name || 'Guest'}</UserName>
              <UserStatus>Available for rides</UserStatus>
            </UserInfo>
            <UserAvatar
              src={myuser?.photoUrl || "/bike.png"}
              onClick={() => signOut(auth)}
              alt="User Avatar"
            />
          </UserProfile>
        </Header>

        {/* Destination Input */}
        // <DestinationSection>
        //   <DestinationInput>
        //     <SearchIcon>🔍</SearchIcon>
        //     <Input placeholder="Where would you like to go?" />
        //     <FavoriteIcon>⭐</FavoriteIcon>
        //   </DestinationInput>
        // </DestinationSection>

        {/* Quick Actions */}
        <QuickActionsSection>
          <SectionTitle>Quick Destinations</SectionTitle>
          <QuickActionsGrid>
            {quickBookingOptions.map((option, index) => (
              <QuickActionCard key={index}>
                <QuickActionIcon>{option.icon}</QuickActionIcon>
                <QuickActionText>{option.text}</QuickActionText>
                <QuickActionTime>{option.time}</QuickActionTime>
              </QuickActionCard>
            ))}
          </QuickActionsGrid>
        </QuickActionsSection>

        {/* Ride Options */}
        <RideOptionsSection>
          <SectionTitle>Choose Your Ride</SectionTitle>
          <RideOptionsGrid>
            <Link href={`/search?ride=car${date ? `&book=${date}` : ""}`}>
              <RideOptionCard>
                <RideOptionIcon>
                  <Image src="/car.png" width={40} height={40} alt="Car" />
                </RideOptionIcon>
                <RideOptionInfo>
                  <RideOptionTitle>Car</RideOptionTitle>
                  <RideOptionSubtitle>4-seater comfort</RideOptionSubtitle>
                </RideOptionInfo>
                <RideOptionPrice>₹120</RideOptionPrice>
              </RideOptionCard>
            </Link>
            
            <Link href={`/search?ride=bike${date ? `&book=${date}` : ""}`}>
              <RideOptionCard>
                <RideOptionIcon>
                  <Image src="/bike.png" width={40} height={40} alt="Bike" />
                </RideOptionIcon>
                <RideOptionInfo>
                  <RideOptionTitle>Bike</RideOptionTitle>
                  <RideOptionSubtitle>Quick & affordable</RideOptionSubtitle>
                </RideOptionInfo>
                <RideOptionPrice>₹45</RideOptionPrice>
              </RideOptionCard>
            </Link>
          </RideOptionsGrid>
        </RideOptionsSection>

        {/* Schedule Ride */}
        <ScheduleSection>
          <SectionTitle>Schedule for Later</SectionTitle>
          <ScheduleCard>
            <ScheduleIcon>📅</ScheduleIcon>
            <ScheduleInfo>
              <ScheduleText>Schedule Ride</ScheduleText>
              <ScheduleSubtext>Book for a specific time</ScheduleSubtext>
            </ScheduleInfo>
            <DateInputContainer>
              <DateInput
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </DateInputContainer>
          </ScheduleCard>
        </ScheduleSection>
      </BottomSheet>
    </AppContainer>
  );
}

// Styled Components
const AppContainer = tw.div`
  flex flex-col h-screen bg-gray-50
`;

const MapContainer = tw.div`
  flex-1 relative
`;

const MapOverlay = tw.div`
  absolute top-0 left-0 right-0 z-10
  p-4
`;

const LocationPinContainer = tw.div`
  bg-white rounded-lg shadow-lg p-3
  flex items-center gap-2
  max-w-xs
`;

const LocationPin = tw.span`
  text-red-500 text-lg
`;

const LocationText = tw.span`
  font-medium text-gray-800 text-sm
`;

const BottomSheet = tw.div`
  bg-white rounded-t-3xl shadow-2xl
  max-h-[65vh] overflow-y-auto
  px-6 py-6 space-y-6
`;

const Header = tw.div`
  flex justify-between items-center
  py-2
`;

const BrandSection = tw.div`
  flex flex-col
`;

const Logo = tw.h1`
  text-2xl font-bold text-gray-800
  tracking-tight
`;

const Tagline = tw.p`
  text-sm text-gray-500
  font-medium
`;

const UserProfile = tw.div`
  flex items-center gap-3
`;

const UserInfo = tw.div`
  text-right
`;

const UserName = tw.p`
  font-semibold text-gray-800 text-sm
`;

const UserStatus = tw.p`
  text-xs text-green-600
`;

const UserAvatar = tw.img`
  w-12 h-12 rounded-full border-2 border-gray-200
  cursor-pointer object-cover
`;

const DestinationSection = tw.div`
  space-y-2
`;

const DestinationInput = tw.div`
  bg-gray-100 rounded-xl p-4
  flex items-center gap-3
  border border-gray-200
`;

const SearchIcon = tw.span`
  text-gray-400 text-lg
`;

const Input = tw.input`
  flex-1 bg-transparent outline-none
  text-gray-800 font-medium
  placeholder-gray-500
`;

const FavoriteIcon = tw.span`
  text-yellow-500 cursor-pointer
`;

const QuickActionsSection = tw.div`
  space-y-3
`;

const SectionTitle = tw.h3`
  font-semibold text-gray-800 text-lg
`;

const QuickActionsGrid = tw.div`
  grid grid-cols-4 gap-3
`;

const QuickActionCard = tw.div`
  bg-gray-50 rounded-lg p-3
  flex flex-col items-center gap-1
  cursor-pointer border border-gray-200
  transition-all duration-200
`;

const QuickActionIcon = tw.span`
  text-2xl
`;

const QuickActionText = tw.span`
  text-xs font-medium text-gray-700
`;

const QuickActionTime = tw.span`
  text-xs text-gray-500
`;

const RideOptionsSection = tw.div`
  space-y-3
`;

const RideOptionsGrid = tw.div`
  space-y-3
`;

const RideOptionCard = tw.div`
  bg-white border border-gray-200 rounded-xl p-4
  flex items-center gap-4
  cursor-pointer transition-all duration-200
  shadow-sm
`;

const RideOptionIcon = tw.div`
  w-12 h-12 bg-blue-50 rounded-lg
  flex items-center justify-center
`;

const RideOptionInfo = tw.div`
  flex-1
`;

const RideOptionTitle = tw.h4`
  font-semibold text-gray-800
`;

const RideOptionSubtitle = tw.p`
  text-sm text-gray-600
`;

const RideOptionPrice = tw.div`
  font-bold text-blue-600 text-lg
`;

const ScheduleSection = tw.div`
  space-y-3
`;

const ScheduleCard = tw.div`
  bg-blue-50 border border-blue-200 rounded-xl p-4
  flex items-center gap-4
`;

const ScheduleIcon = tw.span`
  text-2xl
`;

const ScheduleInfo = tw.div`
  flex-1
`;

const ScheduleText = tw.h4`
  font-semibold text-gray-800
`;

const ScheduleSubtext = tw.p`
  text-sm text-gray-600
`;

const DateInputContainer = tw.div`
  bg-white rounded-lg border border-gray-300
`;

const DateInput = tw.input`
  p-2 rounded-lg bg-transparent outline-none
  text-gray-800 font-medium
`;
