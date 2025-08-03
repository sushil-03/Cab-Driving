import tw from "tailwind-styled-components/dist/tailwind";
import { useState, useEffect } from "react";

const SimpleMap = ({ pick, drop }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <MapWrapper>
      <MapHeader>
        <LocationInfo>
          <LocationPin>📍</LocationPin>
          <LocationText>
            <LocationTitle>Current Location</LocationTitle>
            <LocationAddress>Dehradun, Uttarakhand</LocationAddress>
          </LocationText>
        </LocationInfo>
        <TimeDisplay>
          {currentTime.toLocaleTimeString()}
        </TimeDisplay>
      </MapHeader>

      <MapContent>
        <MapGrid>
          {/* Create a simple grid pattern to simulate map */}
          {Array.from({ length: 20 }, (_, i) => (
            <GridRow key={i}>
              {Array.from({ length: 20 }, (_, j) => (
                <GridCell key={j} className={`
                  ${(i + j) % 4 === 0 ? 'bg-green-100' : ''}
                  ${(i + j) % 7 === 0 ? 'bg-blue-50' : ''}
                  ${(i + j) % 11 === 0 ? 'bg-gray-100' : ''}
                `} />
              ))}
            </GridRow>
          ))}
        </MapGrid>

        {/* Current location marker */}
        <LocationMarker>
          <CurrentLocationDot />
          <LocationPulse />
        </LocationMarker>

        {/* Destination markers if provided */}
        {pick && (
          <PickupMarker>
            <MarkerIcon>🚗</MarkerIcon>
          </PickupMarker>
        )}

        {drop && (
          <DropMarker>
            <MarkerIcon>🏁</MarkerIcon>
          </DropMarker>
        )}
      </MapContent>

      <MapFooter>
        <StatusBadge>
          <StatusDot />
          <StatusText>Live Location</StatusText>
        </StatusBadge>
        <CoordinatesText>
          28.6139° N, 77.2090° E
        </CoordinatesText>
      </MapFooter>
    </MapWrapper>
  );
};

export default SimpleMap;

const MapWrapper = tw.div`
  flex-1 bg-gradient-to-br from-blue-50 to-green-50
  flex flex-col relative overflow-hidden
`;

const MapHeader = tw.div`
  absolute top-0 left-0 right-0 z-20
  bg-white/90 backdrop-blur-sm
  p-4 flex justify-between items-center
  border-b border-gray-200/50
`;

const LocationInfo = tw.div`
  flex items-center gap-3
`;

const LocationPin = tw.span`
  text-2xl
`;

const LocationText = tw.div`
  flex flex-col
`;

const LocationTitle = tw.span`
  font-semibold text-gray-800
`;

const LocationAddress = tw.span`
  text-sm text-gray-600
`;

const TimeDisplay = tw.div`
  bg-blue-600 text-white px-3 py-1
  rounded-full text-sm font-medium
`;

const MapContent = tw.div`
  flex-1 relative
`;

const MapGrid = tw.div`
  absolute inset-0 opacity-30
`;

const GridRow = tw.div`
  flex h-8
`;

const GridCell = tw.div`
  flex-1 border-r border-b border-gray-200/30
`;

const LocationMarker = tw.div`
  absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
  z-10
`;

const CurrentLocationDot = tw.div`
  w-4 h-4 bg-blue-600 rounded-full
  border-2 border-white shadow-lg
`;

const LocationPulse = tw.div`
  absolute inset-0 w-4 h-4 bg-blue-400 rounded-full
  animate-ping opacity-60
`;

const PickupMarker = tw.div`
  absolute top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2
  z-10
`;

const DropMarker = tw.div`
  absolute top-3/4 right-1/4 transform translate-x-1/2 -translate-y-1/2
  z-10
`;

const MarkerIcon = tw.span`
  text-2xl filter drop-shadow-lg
`;

const MapFooter = tw.div`
  absolute bottom-0 left-0 right-0 z-20
  bg-white/90 backdrop-blur-sm
  p-4 flex justify-between items-center
  border-t border-gray-200/50
`;

const StatusBadge = tw.div`
  flex items-center gap-2
`;

const StatusDot = tw.div`
  w-2 h-2 bg-green-500 rounded-full animate-pulse
`;

const StatusText = tw.span`
  text-sm font-medium text-gray-700
`;

const CoordinatesText = tw.span`
  text-xs text-gray-500 font-mono
`;
