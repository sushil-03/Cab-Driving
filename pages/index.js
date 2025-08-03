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
  const [locationError, setLocationError] = useState(null);
  const [currentCoordinates, setCurrentCoordinates] = useState(null);

  useEffect(() => {
    return onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser({
          name: user.displayName,
          photoUrl: user.photoURL,
        });
      } else {
        setUser(null);
        router.push("/login");
      }
    });
  }, [router]);

  useEffect(() => {
    // Get actual current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          // Store coordinates for map
          setCurrentCoordinates([longitude, latitude]); // Mapbox uses [lng, lat] format

          try {
            // Try to get address using Nominatim (OpenStreetMap) - free service
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
            );

            if (response.ok) {
              const data = await response.json();
              if (data.display_name) {
                // Extract a shorter, more readable address
                const addressParts = data.display_name.split(", ");
                const shortAddress = addressParts.slice(0, 3).join(", ");
                setCurrentLocation(shortAddress);
              } else {
                setCurrentLocation(
                  `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
                );
              }
            } else {
              // Fallback to coordinates if API fails
              setCurrentLocation(
                `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
              );
            }
          } catch (error) {
            console.error("Error getting address:", error);
            // Fallback to coordinates
            setCurrentLocation(
              `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
            );
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          let errorMessage = "Location unavailable";

          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage =
                "Location access denied. Please enable location in your browser settings.";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = "Location information unavailable.";
              break;
            case error.TIMEOUT:
              errorMessage = "Location request timed out.";
              break;
            default:
              errorMessage = "Unable to get your location.";
              break;
          }

          setLocationError(errorMessage);
          setCurrentLocation("Location unavailable");
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5 minutes
        }
      );
    } else {
      setLocationError("Geolocation not supported");
      setCurrentLocation("Location not supported");
    }
  }, []);

  const quickBookingOptions = [
    {
      icon: "🏠",
      text: "Home",
      time: "5 min",
      destination: "Home",
      coordinates: null, // Will be set from saved locations or current location
    },
    {
      icon: "🏢",
      text: "Office",
      time: "12 min",
      destination: "Office",
      coordinates: null,
    },
    {
      icon: "🏪",
      text: "Mall",
      time: "8 min",
      destination: "Shopping Mall",
      coordinates: null,
    },
    {
      icon: "🏥",
      text: "Hospital",
      time: "15 min",
      destination: "Hospital",
      coordinates: null,
    },
  ];

  const handleQuickDestination = (option) => {
    // Check if user has saved addresses for Home/Office
    let savedAddress = null;

    if (option.text === "Home" || option.text === "Office") {
      try {
        if (typeof window !== "undefined") {
          const savedAddresses =
            JSON.parse(localStorage.getItem("savedAddresses")) || {};
          savedAddress = savedAddresses[option.text.toLowerCase()];
        }
      } catch (error) {
        console.error("Error loading saved addresses:", error);
      }
    }
    console.log("savedAddress-----", savedAddress);

    // Navigate to search page with the destination
    const destination = savedAddress
      ? savedAddress.address
      : option.destination;
    const searchParams = new URLSearchParams({
      destination: destination,
      ride: "car", // Default to car ride
    });

    if (date) {
      searchParams.append("book", date);
    }

    router.push(`/search?${searchParams.toString()}`);
  };

  const handleSetupAddress = (option) => {
    // Navigate to setup address page
    router.push(`/setup-address?type=${option.text.toLowerCase()}`);
  };

  const requestLocation = () => {
    // Clear previous error
    setLocationError(null);
    setCurrentLocation("Getting location...");

    // Request location again
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentCoordinates([longitude, latitude]);

          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
            );

            if (response.ok) {
              const data = await response.json();
              if (data.display_name) {
                const addressParts = data.display_name.split(", ");
                const shortAddress = addressParts.slice(0, 3).join(", ");
                setCurrentLocation(shortAddress);
              } else {
                setCurrentLocation(
                  `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
                );
              }
            } else {
              setCurrentLocation(
                `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
              );
            }
          } catch (error) {
            console.error("Error getting address:", error);
            setCurrentLocation(
              `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
            );
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          let errorMessage = "Location unavailable";

          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage =
                "Location access denied. Please enable location in your browser settings.";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = "Location information unavailable.";
              break;
            case error.TIMEOUT:
              errorMessage = "Location request timed out.";
              break;
            default:
              errorMessage = "Unable to get your location.";
              break;
          }

          setLocationError(errorMessage);
          setCurrentLocation("Location unavailable");
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000,
        }
      );
    }
  };

  return (
    <AppContainer>
      <MapContainer>
        <Map id="map" />
        <MapOverlay>
          <LocationPinContainer>
            <LocationPin>{locationError ? "⚠️" : "📍"}</LocationPin>
            <LocationText>
              {locationError ? locationError : currentLocation}
            </LocationText>
            {locationError && (
              <EnableLocationButton onClick={() => requestLocation()}>
                Enable Location
              </EnableLocationButton>
            )}
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
              <UserName>Hi, {myuser?.name || "Guest"}</UserName>
              <UserStatus>Available for rides</UserStatus>
            </UserInfo>
            <UserAvatar
              src={myuser?.photoUrl || "/bike.png"}
              onClick={() => signOut(auth)}
              alt="User Avatar"
            />
          </UserProfile>
        </Header>

        {/* Destination Input 
        <DestinationSection>
          <DestinationInput>
            <SearchIcon>🔍</SearchIcon>
            <Input placeholder="Where would you like to go?" />
            <FavoriteIcon>⭐</FavoriteIcon>
          </DestinationInput>
        </DestinationSection>*/}

        {/* Quick Actions */}
        <QuickActionsSection>
          <SectionTitle>Quick Destinations</SectionTitle>
          <QuickActionsGrid>
            {quickBookingOptions.map((option, index) => {
              // Check if address is saved for Home/Office
              let isSaved = false;
              if (option.text === "Home" || option.text === "Office") {
                try {
                  if (typeof window !== "undefined") {
                    const savedAddresses =
                      JSON.parse(localStorage.getItem("savedAddresses")) || {};
                    isSaved = !!savedAddresses[option.text.toLowerCase()];
                  }
                } catch (error) {
                  console.error("Error checking saved addresses:", error);
                }
              }

              return (
                <QuickActionCard
                  key={index}
                  onClick={() => handleQuickDestination(option)}
                  title={
                    option.text === "Home" || option.text === "Office"
                      ? `Click to book ride, long press to set address`
                      : ""
                  }
                >
                  <QuickActionIcon>{option.icon}</QuickActionIcon>
                  <QuickActionText>{option.text}</QuickActionText>
                  <QuickActionTime>{option.time}</QuickActionTime>
                  {isSaved && <SavedIndicator>✓</SavedIndicator>}
                  {(option.text === "Home" || option.text === "Office") &&
                    !isSaved && (
                      <SetupButton
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSetupAddress(option);
                        }}
                      >
                        Set
                      </SetupButton>
                    )}
                </QuickActionCard>
              );
            })}
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
                min={new Date().toISOString().split("T")[0]}
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

const EnableLocationButton = tw.button`
  bg-blue-500 text-white px-3 py-1
  rounded text-xs font-medium
  hover:bg-blue-600 transition-colors
  ml-2
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
  transition-all duration-200 hover:bg-gray-100
  hover:shadow-md relative
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

const SavedIndicator = tw.span`
  absolute -top-1 -right-1
  w-4 h-4 bg-green-500 text-white
  rounded-full text-xs flex items-center justify-center
  font-bold
`;

const SetupButton = tw.button`
  absolute -bottom-1 -right-1
  bg-blue-500 text-white px-2 py-1
  rounded text-xs font-medium
  hover:bg-blue-600 transition-colors
`;

const RideOptionsSection = tw.div`
  space-y-3 flex flex-col
`;

const RideOptionsGrid = tw.div`
  flex text-left justify-start items-start mr-5 mt-3
`;

const RideOptionCard = tw.div`
  bg-white border border-gray-200 rounded-xl p-4
  flex items-center gap-4
  cursor-pointer transition-all duration-200
  shadow-sm mr-6
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
