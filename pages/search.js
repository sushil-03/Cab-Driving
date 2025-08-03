import tw from "tailwind-styled-components/dist/tailwind";
import { useRouter } from "next/router";
import Link from "next/link";
import { useState, useEffect } from "react";
import Image from "next/image";

const Search = () => {
  const router = useRouter();
  const [pickup, setPickUp] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [savedLocations, setSavedLocations] = useState([]);
  const [isFromFocused, setIsFromFocused] = useState(false);
  const [isToFocused, setIsToFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeField, setActiveField] = useState(null);

  const { book, ride } = router.query;

  // Load saved locations from localStorage
  useEffect(() => {
    const loadSavedLocations = () => {
      try {
        const saved = JSON.parse(localStorage.getItem("savedLocations")) || [];
        setSavedLocations(saved);
      } catch (error) {
        console.error("Error loading saved locations:", error);
        setSavedLocations([]);
      }
    };
    loadSavedLocations();
  }, []);

  const handleBack = () => {
    router.push("/");
  };

  const saveLocation = () => {
    if (pickup.trim() && dropoff.trim()) {
      const newLocation = {
        id: Date.now(),
        from: pickup.trim(),
        to: dropoff.trim(),
        timestamp: new Date().toISOString(),
        frequency: 1
      };

      // Check if location already exists
      const existingIndex = savedLocations.findIndex(
        loc => loc.from.toLowerCase() === pickup.toLowerCase() && 
               loc.to.toLowerCase() === dropoff.toLowerCase()
      );

      let updatedLocations;
      if (existingIndex !== -1) {
        // Increment frequency if exists
        updatedLocations = [...savedLocations];
        updatedLocations[existingIndex].frequency += 1;
        updatedLocations[existingIndex].timestamp = new Date().toISOString();
      } else {
        // Add new location
        updatedLocations = [newLocation, ...savedLocations].slice(0, 10); // Keep only 10 most recent
      }

      setSavedLocations(updatedLocations);
      localStorage.setItem("savedLocations", JSON.stringify(updatedLocations));
    }
  };

  const selectSavedLocation = (location) => {
    if (activeField === 'pickup') {
      setPickUp(location.from);
    } else if (activeField === 'dropoff') {
      setDropoff(location.to);
    } else {
      setPickUp(location.from);
      setDropoff(location.to);
    }
    setShowSuggestions(false);
    setActiveField(null);
  };

  const swapLocations = () => {
    const temp = pickup;
    setPickUp(dropoff);
    setDropoff(temp);
  };

  const clearField = (field) => {
    if (field === 'pickup') {
      setPickUp("");
    } else {
      setDropoff("");
    }
  };

  const deleteSavedLocation = (id) => {
    const updatedLocations = savedLocations.filter(loc => loc.id !== id);
    setSavedLocations(updatedLocations);
    localStorage.setItem("savedLocations", JSON.stringify(updatedLocations));
  };

  const quickLocations = [
    { icon: "🏠", name: "Home", address: "123 Home Street" },
    { icon: "🏢", name: "Office", address: "456 Business District" },
    { icon: "🏥", name: "Hospital", address: "City General Hospital" },
    { icon: "🏪", name: "Mall", address: "Central Shopping Mall" },
  ];

  return (
    <Container>
      {/* Header */}
      <Header>
        <BackButton onClick={handleBack}>
          <BackIcon>←</BackIcon>
        </BackButton>
        <HeaderTitle>Set Destination</HeaderTitle>
        <HeaderAction />
      </Header>

      {/* Location Input Section */}
      <LocationInputSection>
        <LocationInputCard>
          <RouteIndicator>
            <StartDot />
            <RouteLine />
            <EndDot />
          </RouteIndicator>

          <InputFields>
            <InputWrapper>
              <InputLabel>From</InputLabel>
              <LocationInput
                placeholder="Enter pickup location"
                value={pickup}
                onChange={(e) => setPickUp(e.target.value)}
                onFocus={() => {
                  setIsFromFocused(true);
                  setActiveField('pickup');
                  setShowSuggestions(true);
                }}
                onBlur={() => setTimeout(() => setIsFromFocused(false), 200)}
                focused={isFromFocused}
              />
              {pickup && (
                <ClearButton onClick={() => clearField('pickup')}>
                  ×
                </ClearButton>
              )}
            </InputWrapper>

            <InputWrapper>
              <InputLabel>To</InputLabel>
              <LocationInput
                placeholder="Where would you like to go?"
                value={dropoff}
                onChange={(e) => setDropoff(e.target.value)}
                onFocus={() => {
                  setIsToFocused(true);
                  setActiveField('dropoff');
                  setShowSuggestions(true);
                }}
                onBlur={() => setTimeout(() => setIsToFocused(false), 200)}
                focused={isToFocused}
              />
              {dropoff && (
                <ClearButton onClick={() => clearField('dropoff')}>
                  ×
                </ClearButton>
              )}
            </InputWrapper>
          </InputFields>

          <ActionButtons>
            <SwapButton onClick={swapLocations}>
              <SwapIcon>⇄</SwapIcon>
            </SwapButton>
            {pickup && dropoff && (
              <SaveButton onClick={saveLocation}>
                <SaveIcon>💾</SaveIcon>
              </SaveButton>
            )}
          </ActionButtons>
        </LocationInputCard>
      </LocationInputSection>

      {/* Quick Access Locations */}
      <QuickAccessSection>
        <SectionTitle>Quick Access</SectionTitle>
        <QuickLocationGrid>
          {quickLocations.map((location, index) => (
            <QuickLocationCard 
              key={index}
              onClick={() => {
                if (activeField === 'pickup') {
                  setPickUp(location.address);
                } else if (activeField === 'dropoff') {
                  setDropoff(location.address);
                } else {
                  setDropoff(location.address);
                }
                setShowSuggestions(false);
              }}
            >
              <QuickLocationIcon>{location.icon}</QuickLocationIcon>
              <QuickLocationInfo>
                <QuickLocationName>{location.name}</QuickLocationName>
                <QuickLocationAddress>{location.address}</QuickLocationAddress>
              </QuickLocationInfo>
            </QuickLocationCard>
          ))}
        </QuickLocationGrid>
      </QuickAccessSection>

      {/* Saved Locations */}
      {savedLocations.length > 0 && (
        <SavedSection>
          <SectionHeader>
            <SectionTitle>Recent Trips</SectionTitle>
            <SavedCount>{savedLocations.length}</SavedCount>
          </SectionHeader>
          <SavedLocationsList>
            {savedLocations.map((location) => (
              <SavedLocationCard 
                key={location.id}
                onClick={() => selectSavedLocation(location)}
              >
                <SavedLocationIcon>📍</SavedLocationIcon>
                <SavedLocationDetails>
                  <SavedLocationRoute>
                    <RouteFromText>{location.from}</RouteFromText>
                    <RouteArrow>→</RouteArrow>
                    <RouteToText>{location.to}</RouteToText>
                  </SavedLocationRoute>
                  <SavedLocationMeta>
                    <FrequencyBadge>Used {location.frequency} time{location.frequency > 1 ? 's' : ''}</FrequencyBadge>
                    <TimestampText>{new Date(location.timestamp).toLocaleDateString()}</TimestampText>
                  </SavedLocationMeta>
                </SavedLocationDetails>
                <DeleteButton 
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteSavedLocation(location.id);
                  }}
                >
                  🗑️
                </DeleteButton>
              </SavedLocationCard>
            ))}
          </SavedLocationsList>
        </SavedSection>
      )}

      {/* Suggestions Overlay */}
      {showSuggestions && savedLocations.length > 0 && (
        <SuggestionsOverlay>
          <SuggestionsCard>
            <SuggestionsHeader>
              <SuggestionsTitle>Recent Locations</SuggestionsTitle>
              <CloseButton onClick={() => setShowSuggestions(false)}>×</CloseButton>
            </SuggestionsHeader>
            <SuggestionsList>
              {savedLocations.slice(0, 5).map((location) => (
                <SuggestionItem 
                  key={location.id}
                  onClick={() => selectSavedLocation(location)}
                >
                  <SuggestionIcon>🕐</SuggestionIcon>
                  <SuggestionText>
                    {activeField === 'pickup' ? location.from : location.to}
                  </SuggestionText>
                </SuggestionItem>
              ))}
            </SuggestionsList>
          </SuggestionsCard>
        </SuggestionsOverlay>
      )}

      {/* Confirm Button */}
      <ConfirmSection>
        <Link
          href={{
            pathname: "/confirm",
            query: { pickup: pickup, dropoff: dropoff, ride: ride, book },
          }}
        >
          <ConfirmButton disabled={!pickup || !dropoff}>
            <ConfirmButtonText>
              {!pickup || !dropoff ? 'Enter both locations' : 'Confirm Locations'}
            </ConfirmButtonText>
            <ConfirmButtonIcon>→</ConfirmButtonIcon>
          </ConfirmButton>
        </Link>
      </ConfirmSection>
    </Container>
  );
};

export default Search;

// Styled Components
const Container = tw.div`
  min-h-screen bg-gray-50
  flex flex-col
`;

const Header = tw.div`
  bg-white shadow-sm
  flex items-center justify-between
  px-4 py-3
  border-b border-gray-200
`;

const BackButton = tw.button`
  w-10 h-10 rounded-full
  bg-gray-100 flex items-center justify-center
  transition-colors duration-200
`;

const BackIcon = tw.span`
  text-xl font-bold text-gray-700
`;

const HeaderTitle = tw.h1`
  text-lg font-semibold text-gray-800
`;

const HeaderAction = tw.div`
  w-10 h-10
`;

const LocationInputSection = tw.div`
  p-4
`;

const LocationInputCard = tw.div`
  bg-white rounded-2xl shadow-lg
  p-4 flex items-center gap-4
  border border-gray-200
`;

const RouteIndicator = tw.div`
  flex flex-col items-center
  justify-center gap-2
`;

const StartDot = tw.div`
  w-3 h-3 rounded-full bg-blue-500
`;

const RouteLine = tw.div`
  w-0.5 h-12 bg-gray-300
`;

const EndDot = tw.div`
  w-3 h-3 bg-red-500
`;

const InputFields = tw.div`
  flex-1 space-y-4
`;

const InputWrapper = tw.div`
  relative
`;

const InputLabel = tw.label`
  text-xs font-medium text-gray-500 mb-1 block
`;

const LocationInput = tw.input`
  w-full p-3 border border-gray-300 rounded-lg
  bg-gray-50 text-gray-800
  transition-all duration-200
  focus:border-blue-500 focus:bg-white focus:outline-none
  placeholder-gray-400
  ${(props) => props.focused ? 'border-blue-500 bg-white shadow-sm' : ''}
`;

const ClearButton = tw.button`
  absolute right-3 top-8
  w-6 h-6 rounded-full bg-gray-200
  flex items-center justify-center
  text-gray-500 text-sm
  transition-colors duration-200
`;

const ActionButtons = tw.div`
  flex flex-col gap-2
`;

const SwapButton = tw.button`
  w-10 h-10 rounded-full
  bg-blue-50 flex items-center justify-center
  transition-colors duration-200
`;

const SwapIcon = tw.span`
  text-blue-600 font-bold
`;

const SaveButton = tw.button`
  w-10 h-10 rounded-full
  bg-green-50 flex items-center justify-center
  transition-colors duration-200
`;

const SaveIcon = tw.span`
  text-green-600 text-sm
`;

const QuickAccessSection = tw.div`
  px-4 py-2
`;

const SectionTitle = tw.h2`
  text-lg font-semibold text-gray-800 mb-3
`;

const QuickLocationGrid = tw.div`
  grid grid-cols-2 gap-3
`;

const QuickLocationCard = tw.div`
  bg-white rounded-xl p-3
  flex items-center gap-3
  border border-gray-200 shadow-sm
  cursor-pointer transition-all duration-200
`;

const QuickLocationIcon = tw.span`
  text-2xl
`;

const QuickLocationInfo = tw.div`
  flex-1
`;

const QuickLocationName = tw.p`
  font-medium text-gray-800 text-sm
`;

const QuickLocationAddress = tw.p`
  text-xs text-gray-500
`;

const SavedSection = tw.div`
  px-4 py-2 flex-1
`;

const SectionHeader = tw.div`
  flex items-center justify-between mb-3
`;

const SavedCount = tw.span`
  bg-blue-100 text-blue-800 text-xs font-medium
  px-2 py-1 rounded-full
`;

const SavedLocationsList = tw.div`
  space-y-2
`;

const SavedLocationCard = tw.div`
  bg-white rounded-xl p-4
  flex items-center gap-3
  border border-gray-200 shadow-sm
  cursor-pointer transition-all duration-200
`;

const SavedLocationIcon = tw.span`
  text-xl
`;

const SavedLocationDetails = tw.div`
  flex-1
`;

const SavedLocationRoute = tw.div`
  flex items-center gap-2 mb-1
`;

const RouteFromText = tw.span`
  font-medium text-gray-800 text-sm
`;

const RouteArrow = tw.span`
  text-gray-400 text-xs
`;

const RouteToText = tw.span`
  font-medium text-gray-800 text-sm
`;

const SavedLocationMeta = tw.div`
  flex items-center gap-3
`;

const FrequencyBadge = tw.span`
  bg-gray-100 text-gray-600 text-xs
  px-2 py-0.5 rounded-full
`;

const TimestampText = tw.span`
  text-xs text-gray-500
`;

const DeleteButton = tw.button`
  w-8 h-8 rounded-full
  bg-red-50 flex items-center justify-center
  text-red-500 text-sm
  transition-colors duration-200
`;

const SuggestionsOverlay = tw.div`
  fixed inset-0 bg-black/20 z-50
  flex items-center justify-center p-4
`;

const SuggestionsCard = tw.div`
  bg-white rounded-2xl shadow-xl
  w-full max-w-md max-h-80
  overflow-hidden
`;

const SuggestionsHeader = tw.div`
  flex items-center justify-between
  px-4 py-3 border-b border-gray-200
`;

const SuggestionsTitle = tw.h3`
  font-semibold text-gray-800
`;

const CloseButton = tw.button`
  w-8 h-8 rounded-full
  bg-gray-100 flex items-center justify-center
  text-gray-500 font-bold
`;

const SuggestionsList = tw.div`
  max-h-64 overflow-y-auto
`;

const SuggestionItem = tw.div`
  flex items-center gap-3 p-4
  border-b border-gray-100 last:border-b-0
  cursor-pointer transition-colors duration-200
`;

const SuggestionIcon = tw.span`
  text-lg
`;

const SuggestionText = tw.span`
  font-medium text-gray-800
`;

const ConfirmSection = tw.div`
  p-4 bg-white border-t border-gray-200
`;

const ConfirmButton = tw.button`
  w-full bg-blue-600 text-white
  py-4 px-6 rounded-xl
  flex items-center justify-between
  font-semibold text-lg
  transition-all duration-200
  disabled:bg-gray-300 disabled:cursor-not-allowed
  shadow-lg
`;

const ConfirmButtonText = tw.span`
  flex-1 text-center
`;

const ConfirmButtonIcon = tw.span`
  text-xl font-bold
`;
