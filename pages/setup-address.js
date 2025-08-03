import tw from "tailwind-styled-components/dist/tailwind";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Map from "../component/Map";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

const SetupAddress = () => {
  const router = useRouter();
  const [myuser, setUser] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [addressType, setAddressType] = useState("home"); // "home" or "office"
  const { type } = router.query;
  const [savedAddresses, setSavedAddresses] = useState({});

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
    // Load existing saved addresses
    try {
      const saved = JSON.parse(localStorage.getItem("savedAddresses")) || {};
      setSavedAddresses(saved);
    } catch (error) {
      console.error("Error loading saved addresses:", error);
    }
  }, []);

  useEffect(() => {
    // Set address type from URL parameter
    if (type && (type === "home" || type === "office")) {
      setAddressType(type);
    }
  }, [type]);

  const handleMapClick = async (event) => {
    const { lng, lat } = event.lngLat;
    console.log("Setup address - Map clicked at:", lng, lat);

    // Set the selected location immediately for visual feedback
    setSelectedLocation([lng, lat]);
    setIsLoading(true);

    try {
      // Get address from coordinates
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );

      if (response.ok) {
        const data = await response.json();
        if (data.display_name) {
          setAddress(data.display_name);
        } else {
          setAddress(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
        }
      } else {
        setAddress(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
      }
    } catch (error) {
      console.error("Error getting address:", error);
      setAddress(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
    } finally {
      setIsLoading(false);
    }
  };

  const saveAddress = () => {
    if (selectedLocation && address.trim()) {
      try {
        const updatedAddresses = {
          ...savedAddresses,
          [addressType]: {
            address: address.trim(),
            coordinates: selectedLocation,
            timestamp: new Date().toISOString(),
          },
        };

        localStorage.setItem(
          "savedAddresses",
          JSON.stringify(updatedAddresses)
        );
        setSavedAddresses(updatedAddresses);

        alert(
          `${
            addressType === "home" ? "Home" : "Office"
          } address saved successfully!`
        );

        // Go back to home page
        router.push("/");
      } catch (error) {
        console.error("Error saving address:", error);
        alert("Error saving address. Please try again.");
      }
    }
  };

  const handleBack = () => {
    router.push("/");
  };

  const clearAddress = () => {
    setSelectedLocation(null);
    setAddress("");
  };

  return (
    <Container>
      <Header>
        <BackButton onClick={handleBack}>←</BackButton>
        <HeaderTitle>
          Set {addressType === "home" ? "Home" : "Office"} Address
        </HeaderTitle>
        <Spacer />
      </Header>

      <MapContainer>
        <Map
          id="setup-map"
          onMapClick={handleMapClick}
          selectedLocation={selectedLocation}
          disablePan={true}
          size="large"
        />

        {selectedLocation && (
          <MapOverlay>
            <LocationCard>
              <LocationIcon>📍</LocationIcon>
              <LocationText>{address}</LocationText>
            </LocationCard>
          </MapOverlay>
        )}
      </MapContainer>

      <BottomSheet>
        {/* <Instructions>
          <InstructionTitle>How to set your address:</InstructionTitle>
          <InstructionList>
            <InstructionItem>
              1. Click anywhere on the map to select your location
            </InstructionItem>
            <InstructionItem>
              2. The address will be automatically detected
            </InstructionItem>
            <InstructionItem>
              3. Click "Save Address" to confirm
            </InstructionItem>
          </InstructionList>
        </Instructions> */}

        {selectedLocation && (
          <AddressSection>
            <AddressLabel>Selected Address:</AddressLabel>
            <AddressDisplay>{address}</AddressDisplay>

            <ButtonGroup>
              <ClearButton onClick={clearAddress}>Clear Selection</ClearButton>
              <SaveButton onClick={saveAddress} disabled={isLoading}>
                {isLoading ? "Loading..." : "Save Address"}
              </SaveButton>
            </ButtonGroup>
          </AddressSection>
        )}

        <SavedAddressesSection>
          <SavedTitle>Saved Addresses:</SavedTitle>
          <SavedAddressCard>
            <SavedAddressIcon>🏠</SavedAddressIcon>
            <SavedAddressInfo>
              <SavedAddressLabel>Home</SavedAddressLabel>
              <SavedAddressText>
                {savedAddresses.home
                  ? savedAddresses.home.address
                  : "No home address saved"}
              </SavedAddressText>
            </SavedAddressInfo>
          </SavedAddressCard>

          <SavedAddressCard>
            <SavedAddressIcon>🏢</SavedAddressIcon>
            <SavedAddressInfo>
              <SavedAddressLabel>Office</SavedAddressLabel>
              <SavedAddressText>
                {savedAddresses.office
                  ? savedAddresses.office.address
                  : "No office address saved"}
              </SavedAddressText>
            </SavedAddressInfo>
          </SavedAddressCard>
        </SavedAddressesSection>
      </BottomSheet>
    </Container>
  );
};

export default SetupAddress;

// Styled Components
const Container = tw.div`
  flex flex-col h-screen bg-gray-50
`;

const Header = tw.div`
  flex items-center justify-between p-4 bg-white shadow-sm
`;

const BackButton = tw.button`
  w-10 h-10 rounded-full bg-gray-100
  flex items-center justify-center text-gray-600
  hover:bg-gray-200 transition-colors
`;

const HeaderTitle = tw.h1`
  text-lg font-semibold text-gray-800
`;

const Spacer = tw.div`w-10`;

const MapContainer = tw.div`
  flex-1 relative min-h-[70vh]
`;

const MapOverlay = tw.div`
  absolute top-4 left-4 right-4 z-10
`;

const LocationCard = tw.div`
  bg-white rounded-lg shadow-lg p-3
  flex items-center gap-2
  max-w-xs
`;

const LocationIcon = tw.span`
  text-red-500 text-lg
`;

const LocationText = tw.span`
  font-medium text-gray-800 text-sm
`;

const BottomSheet = tw.div`
  bg-white rounded-t-3xl shadow-2xl
  max-h-[30vh] overflow-y-auto
  px-6 py-6 space-y-6 flex flex-col 
`;

const Instructions = tw.div`
  space-y-3
`;

const InstructionTitle = tw.h3`
  font-semibold text-gray-800 text-lg
`;

const InstructionList = tw.div`
  space-y-2
`;

const InstructionItem = tw.p`
  text-sm text-gray-600
`;

const AddressSection = tw.div`
  space-y-3
`;

const AddressLabel = tw.label`
  font-medium text-gray-700
`;

const AddressDisplay = tw.div`
  bg-gray-50 rounded-lg p-3
  text-gray-800 font-medium
`;

const ButtonGroup = tw.div`
  flex gap-3
`;

const ClearButton = tw.button`
  flex-1 bg-gray-100 text-gray-700 px-4 py-3
  rounded-lg font-medium transition-colors
  hover:bg-gray-200
`;

const SaveButton = tw.button`
  flex-1 bg-blue-600 text-white px-4 py-3
  rounded-lg font-medium transition-colors
  hover:bg-blue-700 disabled:opacity-50
`;

const SavedAddressesSection = tw.div`
  space-y-3
`;

const SavedTitle = tw.h4`
  font-semibold text-gray-800
`;

const SavedAddressCard = tw.div`
  bg-gray-50 rounded-lg p-3
  flex items-center gap-3
`;

const SavedAddressIcon = tw.span`
  text-2xl
`;

const SavedAddressInfo = tw.div`
  flex-1
`;

const SavedAddressLabel = tw.div`
  font-medium text-gray-800
`;

const SavedAddressText = tw.div`
  text-sm text-gray-600
`;
