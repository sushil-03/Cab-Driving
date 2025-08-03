import { useEffect, useState } from "react";
import tw from "tailwind-styled-components/dist/tailwind";
import Link from "next/link";
import { useRouter } from "next/router";
import Map from "../component/Map";
import Image from "next/image";
import { carList } from "../data/carList";
import { bikeList } from "../data/bikeList";

const Confirm = () => {
  const router = useRouter();
  const [pick, setPick] = useState();
  const [drop, setDrop] = useState();
  const [duration, setDuration] = useState(0);
  const [distance, setDistance] = useState(0);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [passengers, setPassengers] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const [estimatedPrice, setEstimatedPrice] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  const { pickup, dropoff, ride, book } = router.query;

  const vehicleList = ride === "car" ? carList : bikeList;

  const getCoordinates = async (location, setter) => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${location}.json?` +
          new URLSearchParams({
            access_token: "pk.eyJ1Ijoic3VzaGlsZSIsImEiOiJja3IyYjh2NW0waW1yMm5yeDEwamtveG52In0.CtiyE_hQWk3oCQdvhx46dw",
            limit: 1,
          })
      );
      const data = await response.json();
      if (data.features?.[0]) {
        setter([data.features[0].center]);
      }
    } catch (error) {
      console.error("Error fetching coordinates:", error);
    }
  };

  const getRouteInfo = async () => {
    if (!pick || !drop) return;
    
    try {
      const response = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${pick[0][0]},${pick[0][1]};${drop[0][0]},${drop[0][1]}?` +
          new URLSearchParams({
            access_token: "pk.eyJ1Ijoic3VzaGlsZSIsImEiOiJja3IyYjh2NW0waW1yMm5yeDEwamtveG52In0.CtiyE_hQWk3oCQdvhx46dw",
          })
      );
      const data = await response.json();
      
      if (data.routes?.[0]) {
        const routeDuration = (data.routes[0].duration / 60).toFixed(0); // minutes
        const routeDistance = (data.routes[0].distance / 1000).toFixed(1); // km
        setDuration(routeDuration);
        setDistance(routeDistance);
      }
    } catch (error) {
      console.error("Error fetching route:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (pickup && dropoff) {
      setIsLoading(true);
      getCoordinates(pickup, setPick);
      getCoordinates(dropoff, setDrop);
    }
  }, [pickup, dropoff]);

  useEffect(() => {
    if (pick && drop) {
      getRouteInfo();
    }
  }, [pick, drop]);

  useEffect(() => {
    if (selectedVehicle && duration) {
      const price = (selectedVehicle.multiplier * duration * passengers).toFixed(0);
      setEstimatedPrice(price);
    }
  }, [selectedVehicle, duration, passengers]);

  const selectVehicle = (vehicle) => {
    setSelectedVehicle(vehicle);
    setErrorMessage("");
  };

  const confirmBooking = () => {
    if (!selectedVehicle) {
      setErrorMessage("Please select a vehicle");
      return;
    }

    if (selectedVehicle.remainingSeat < passengers) {
      setErrorMessage(`Only ${selectedVehicle.remainingSeat} seats available`);
      return;
    }

    router.push({
      pathname: "/payment",
      query: {
        book,
        ride,
        id: selectedVehicle.id,
        member: passengers,
        distance,
        price: estimatedPrice,
        pickup,
        dropoff
      },
    });
  };

  const formatTime = (minutes) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <Container>
      {/* Header */}
      <Header>
        <BackButton onClick={() => router.back()}>
          <BackIcon>←</BackIcon>
        </BackButton>
        <HeaderTitle>Confirm Route</HeaderTitle>
        <HeaderAction>
          <DetailsButton onClick={() => setShowDetails(!showDetails)}>
            <DetailsIcon>{showDetails ? '✕' : 'ⓘ'}</DetailsIcon>
          </DetailsButton>
        </HeaderAction>
      </Header>

      {/* Map Section */}
      <MapSection>
        <Map pick={pick} drop={drop} />
        {!isLoading && (
          <RouteInfo>
            <RouteInfoCard>
              <RouteStats>
                <StatItem>
                  <StatIcon>📍</StatIcon>
                  <StatLabel>Distance</StatLabel>
                  <StatValue>{distance} km</StatValue>
                </StatItem>
                <StatDivider />
                <StatItem>
                  <StatIcon>⏱️</StatIcon>
                  <StatLabel>Duration</StatLabel>
                  <StatValue>{formatTime(duration)}</StatValue>
                </StatItem>
              </RouteStats>
            </RouteInfoCard>
          </RouteInfo>
        )}
      </MapSection>

      {/* Route Details Modal */}
      {showDetails && (
        <DetailsModal>
          <DetailsCard>
            <DetailsHeader>
              <DetailsTitle>Route Details</DetailsTitle>
              <CloseButton onClick={() => setShowDetails(false)}>×</CloseButton>
            </DetailsHeader>
            <DetailsContent>
              <DetailItem>
                <DetailLabel>From:</DetailLabel>
                <DetailValue>{pickup}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>To:</DetailLabel>
                <DetailValue>{dropoff}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Distance:</DetailLabel>
                <DetailValue>{distance} km</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Est. Duration:</DetailLabel>
                <DetailValue>{formatTime(duration)}</DetailValue>
              </DetailItem>
              {book && (
                <DetailItem>
                  <DetailLabel>Scheduled:</DetailLabel>
                  <DetailValue>{new Date(book).toLocaleDateString()}</DetailValue>
                </DetailItem>
              )}
            </DetailsContent>
          </DetailsCard>
        </DetailsModal>
      )}

      {/* Bottom Sheet */}
      <BottomSheet>
        {/* Passenger Selector */}
        {ride === "car" && (
          <PassengerSection>
            <SectionTitle>Passengers</SectionTitle>
            <PassengerControls>
              <PassengerButton 
                onClick={() => setPassengers(Math.max(1, passengers - 1))}
                disabled={passengers <= 1}
              >
                −
              </PassengerButton>
              <PassengerDisplay>
                <PassengerCount>{passengers}</PassengerCount>
                <PassengerLabel>passenger{passengers > 1 ? 's' : ''}</PassengerLabel>
              </PassengerDisplay>
              <PassengerButton 
                onClick={() => setPassengers(Math.min(8, passengers + 1))}
                disabled={passengers >= 8}
              >
                +
              </PassengerButton>
            </PassengerControls>
          </PassengerSection>
        )}

        {/* Vehicle Selection */}
        <VehicleSection>
          <SectionTitle>Choose Your Ride</SectionTitle>
          <VehicleList>
            {vehicleList.map((vehicle) => {
              const isSelected = selectedVehicle?.id === vehicle.id;
              const isAvailable = vehicle.remainingSeat >= passengers;
              const vehiclePrice = duration ? (vehicle.multiplier * duration * passengers).toFixed(0) : "...";

              return (
                <VehicleCard
                  key={vehicle.id}
                  onClick={() => isAvailable && selectVehicle(vehicle)}
                  selected={isSelected}
                  available={isAvailable}
                >
                  <VehicleImageContainer>
                    <VehicleImage 
                      src={vehicle.imgUrl} 
                      alt={vehicle.service}
                      width={80}
                      height={60}
                    />
                    {!isAvailable && <UnavailableBadge>Full</UnavailableBadge>}
                  </VehicleImageContainer>
                  
                  <VehicleInfo>
                    <VehicleName>{vehicle.service}</VehicleName>
                    <VehicleDetails>
                      <DetailRow>
                        <VehicleETA>{vehicle.multiplier} min away</VehicleETA>
                        <VehicleSeats>
                          {vehicle.remainingSeat} seat{vehicle.remainingSeat > 1 ? 's' : ''} available
                        </VehicleSeats>
                      </DetailRow>
                    </VehicleDetails>
                  </VehicleInfo>

                  <VehiclePricing>
                    <VehiclePrice>₹{vehiclePrice}</VehiclePrice>
                    {passengers > 1 && (
                      <PricePerPerson>₹{(vehiclePrice / passengers).toFixed(0)} per person</PricePerPerson>
                    )}
                  </VehiclePricing>

                  {isSelected && <SelectedIndicator>✓</SelectedIndicator>}
                </VehicleCard>
              );
            })}
          </VehicleList>
        </VehicleSection>

        {/* Error Message */}
        {errorMessage && (
          <ErrorMessage>
            <ErrorIcon>⚠️</ErrorIcon>
            <ErrorText>{errorMessage}</ErrorText>
          </ErrorMessage>
        )}

        {/* Booking Summary */}
        {selectedVehicle && (
          <BookingSummary>
            <SummaryTitle>Booking Summary</SummaryTitle>
            <SummaryDetails>
              <SummaryRow>
                <SummaryLabel>Vehicle:</SummaryLabel>
                <SummaryValue>{selectedVehicle.service}</SummaryValue>
              </SummaryRow>
              <SummaryRow>
                <SummaryLabel>Passengers:</SummaryLabel>
                <SummaryValue>{passengers}</SummaryValue>
              </SummaryRow>
              <SummaryRow>
                <SummaryLabel>Distance:</SummaryLabel>
                <SummaryValue>{distance} km</SummaryValue>
              </SummaryRow>
              <SummaryRow>
                <SummaryLabel>Est. Duration:</SummaryLabel>
                <SummaryValue>{formatTime(duration)}</SummaryValue>
              </SummaryRow>
              <SummaryDivider />
              <SummaryRow>
                <SummaryLabel>Total Fare:</SummaryLabel>
                <TotalPrice>₹{estimatedPrice}</TotalPrice>
              </SummaryRow>
            </SummaryDetails>
          </BookingSummary>
        )}

        {/* Confirm Button */}
        <ConfirmSection>
          <ConfirmButton 
            onClick={confirmBooking}
            disabled={!selectedVehicle || isLoading}
          >
            <ConfirmButtonText>
              {!selectedVehicle ? 'Select a vehicle' : `Book ${selectedVehicle.service} - ₹${estimatedPrice}`}
            </ConfirmButtonText>
            <ConfirmButtonIcon>→</ConfirmButtonIcon>
          </ConfirmButton>
        </ConfirmSection>
      </BottomSheet>
    </Container>
  );
};

export default Confirm;

// Styled Components
const Container = tw.div`
  flex flex-col h-screen bg-gray-50
`;

const Header = tw.div`
  bg-white shadow-sm z-20
  flex items-center justify-between
  px-4 py-3 border-b border-gray-200
`;

const BackButton = tw.button`
  w-10 h-10 rounded-full bg-gray-100
  flex items-center justify-center
  transition-colors duration-200
`;

const BackIcon = tw.span`
  text-xl font-bold text-gray-700
`;

const HeaderTitle = tw.h1`
  text-lg font-semibold text-gray-800
`;

const HeaderAction = tw.div`
  flex items-center
`;

const DetailsButton = tw.button`
  w-10 h-10 rounded-full bg-blue-50
  flex items-center justify-center
  transition-colors duration-200
`;

const DetailsIcon = tw.span`
  text-blue-600 font-bold
`;

const MapSection = tw.div`
  flex-1 relative min-h-0
`;

const RouteInfo = tw.div`
  absolute bottom-4 left-4 right-4 z-10
`;

const RouteInfoCard = tw.div`
  bg-white/90 backdrop-blur-sm rounded-xl
  p-4 shadow-lg border border-white/20
`;

const RouteStats = tw.div`
  flex items-center justify-center gap-6
`;

const StatItem = tw.div`
  flex flex-col items-center gap-1
`;

const StatIcon = tw.span`
  text-xl
`;

const StatLabel = tw.span`
  text-xs text-gray-600 font-medium
`;

const StatValue = tw.span`
  text-sm font-bold text-gray-800
`;

const StatDivider = tw.div`
  w-px h-8 bg-gray-300
`;

const DetailsModal = tw.div`
  fixed inset-0 bg-black/30 z-50
  flex items-center justify-center p-4
`;

const DetailsCard = tw.div`
  bg-white rounded-2xl shadow-xl
  w-full max-w-sm
`;

const DetailsHeader = tw.div`
  flex items-center justify-between
  px-6 py-4 border-b border-gray-200
`;

const DetailsTitle = tw.h3`
  font-semibold text-gray-800
`;

const CloseButton = tw.button`
  w-8 h-8 rounded-full bg-gray-100
  flex items-center justify-center
  text-gray-500 font-bold
`;

const DetailsContent = tw.div`
  p-6 space-y-4
`;

const DetailItem = tw.div`
  flex justify-between items-center
`;

const DetailLabel = tw.span`
  text-gray-600 font-medium
`;

const DetailValue = tw.span`
  text-gray-800 font-semibold
`;

const BottomSheet = tw.div`
  bg-white rounded-t-3xl shadow-2xl
  max-h-[60vh] overflow-y-auto
  px-6 py-4 space-y-6
`;

const PassengerSection = tw.div`
  space-y-3
`;

const SectionTitle = tw.h3`
  font-semibold text-gray-800 text-lg
`;

const PassengerControls = tw.div`
  flex items-center justify-center gap-6
  bg-gray-50 rounded-xl p-4
`;

const PassengerButton = tw.button`
  w-10 h-10 rounded-full bg-white
  flex items-center justify-center
  font-bold text-xl text-gray-700
  border border-gray-200 shadow-sm
  transition-all duration-200
  disabled:opacity-50 disabled:cursor-not-allowed
`;

const PassengerDisplay = tw.div`
  text-center
`;

const PassengerCount = tw.div`
  text-2xl font-bold text-gray-800
`;

const PassengerLabel = tw.div`
  text-sm text-gray-600
`;

const VehicleSection = tw.div`
  space-y-4
`;

const VehicleList = tw.div`
  space-y-3
`;

const VehicleCard = tw.div`
  bg-white border rounded-xl p-4
  flex items-center gap-4
  cursor-pointer transition-all duration-200
  relative
  ${(props) => props.selected ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}
  ${(props) => !props.available ? 'opacity-50 cursor-not-allowed' : ''}
`;

const VehicleImageContainer = tw.div`
  relative
`;

const VehicleImage = tw(Image)`
  object-contain
`;

const UnavailableBadge = tw.div`
  absolute -top-1 -right-1
  bg-red-500 text-white text-xs
  px-2 py-0.5 rounded-full
`;

const VehicleInfo = tw.div`
  flex-1
`;

const VehicleName = tw.h4`
  font-semibold text-gray-800 mb-1
`;

const VehicleDetails = tw.div`
  space-y-1
`;

const DetailRow = tw.div`
  flex items-center gap-4
`;

const VehicleETA = tw.span`
  text-sm text-blue-600 font-medium
`;

const VehicleSeats = tw.span`
  text-sm text-green-600
`;

const VehiclePricing = tw.div`
  text-right
`;

const VehiclePrice = tw.div`
  font-bold text-lg text-gray-800
`;

const PricePerPerson = tw.div`
  text-xs text-gray-500
`;

const SelectedIndicator = tw.div`
  absolute top-2 right-2
  w-6 h-6 rounded-full bg-blue-500
  flex items-center justify-center
  text-white text-sm font-bold
`;

const ErrorMessage = tw.div`
  bg-red-50 border border-red-200 rounded-lg
  p-3 flex items-center gap-2
`;

const ErrorIcon = tw.span`
  text-red-500
`;

const ErrorText = tw.span`
  text-red-700 font-medium
`;

const BookingSummary = tw.div`
  bg-gray-50 rounded-xl p-4
`;

const SummaryTitle = tw.h4`
  font-semibold text-gray-800 mb-3
`;

const SummaryDetails = tw.div`
  space-y-2
`;

const SummaryRow = tw.div`
  flex justify-between items-center
`;

const SummaryLabel = tw.span`
  text-gray-600
`;

const SummaryValue = tw.span`
  text-gray-800 font-medium
`;

const SummaryDivider = tw.div`
  border-t border-gray-300 my-2
`;

const TotalPrice = tw.span`
  text-lg font-bold text-blue-600
`;

const ConfirmSection = tw.div`
  pt-2
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
