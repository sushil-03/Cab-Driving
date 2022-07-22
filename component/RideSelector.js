import { useState, useEffect } from "react";
import tw from "tailwind-styled-components/dist/tailwind";
import { carList } from "../data/carList";
import { bikeList } from "../data/bikeList";
import { Text } from "@mantine/core";
import { Alert } from "@mantine/core";
import { AlertCircle } from "tabler-icons-react";

import Router from "next/router";
const RideSelector = ({ pick, drop, ride, book }) => {
  const [duration, setDuration] = useState(0);
  const [distance, setDistance] = useState(0);
  const [myCar, setMyCar] = useState();
  const [myBike, setMyBike] = useState();
  const [member, setMember] = useState(1);
  const [message, setMessage] = useState("");
  var vehicleList;
  if (ride == "car") {
    vehicleList = carList;
  } else {
    vehicleList = bikeList;
  }
  useEffect(() => {
    console.log(myBike);
    if (pick && drop) {
      console.log(pick, drop);
      fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${pick[0][0]},${pick[0][1]};${drop[0][0]},${drop[0][1]}?` +
          new URLSearchParams({
            access_token:
              "pk.eyJ1Ijoic3VzaGlsZSIsImEiOiJja3IyYjh2NW0waW1yMm5yeDEwamtveG52In0.CtiyE_hQWk3oCQdvhx46dw",
          })
      )
        .then((res) => res.json())
        .then((data) => {
          setDuration(data && (data.routes[0].duration / 50).toFixed(1));
          setDistance(data && (data.routes[0].distance / 1050).toFixed(1));
        });
    }
  }, [pick, drop, myBike]);
  const confirmTraverl = () => {
    if (myCar) {
      if (myCar.remainingSeat < member) {
        setMessage("Not enough seat! Please choose another side.");
        return;
      } else {
        const id = myCar.id;
        Router.push({
          pathname: "/payment",
          query: {
            book,
            ride,
            id,
            member,
            distance,
            price: (myCar.multiplier * duration).toFixed(2),
          },
        });
      }
    } else if (myBike) {
      const id = myBike.id;
      Router.push({
        pathname: "/payment",
        query: {
          book,
          ride,
          id,
          member: 1,
          distance,
          price: (myBike.multiplier * duration).toFixed(2),
        },
      });
    } else {
      setMessage("Please choose your ride!!!");
    }
  };
  return (
    <Wrapper>
      <Member>
        <input
          type="range"
          name=""
          id=""
          className="w-full "
          min="1"
          max="10"
          value={member}
          onChange={(e) => setMember(e.target.value)}
        />
        <Text mt="md" size="sm">
          Total passenger: <b>{member}</b>
        </Text>
      </Member>
      <Title>Choose a ride, or swipe up for more</Title>
      {message && (
        <Alert
          icon={<AlertCircle size={16} />}
          title="Alert "
          color="red"
          withCloseButton
          onClose={() => setMessage()}
        >
          {message}
        </Alert>
      )}
      <VehicleList>
        {vehicleList.map((vehicle, key) => {
          if (vehicle.remainingSeat <= 0) return;
          return (
            <Vehicle
              key={key}
              onClick={() => {
                if (ride == "car") {
                  setMyCar(vehicle);
                } else {
                  setMyBike(vehicle);
                }
              }}
              className={
                (myCar || myBike) &&
                (myCar?.id == vehicle.id || myBike?.id == vehicle.id)
                  ? "bg-blue-200"
                  : "bg-white"
              }
            >
              <VehicleImage src={vehicle.imgUrl}></VehicleImage>
              <VehicleDetail>
                <Service>{vehicle.service}</Service>
                <Time>{vehicle.multiplier} min away</Time>
                <Seat
                  className={
                    vehicle.multiplier == 0 ? "text-red-500" : "text-green-600"
                  }
                >
                  Available Seats :{" "}
                  <span className="font-bold text-lg">
                    {vehicle.remainingSeat}
                  </span>
                </Seat>
              </VehicleDetail>
              <Distance>
                Distance{" "}
                <span className="text-lg font-bold">{distance} km</span>
              </Distance>
              <Price>
                Price{" "}
                <span className="text-lg font-bold">
                  {`₹ ` + (vehicle.multiplier * duration).toFixed()}
                </span>
                / per member
              </Price>
            </Vehicle>
          );
        })}
      </VehicleList>
      <ConfirmButtonContainer onClick={confirmTraverl}>
        <ConfirmButton>Confirm Travel</ConfirmButton>
      </ConfirmButtonContainer>
    </Wrapper>
  );
};

export default RideSelector;
const Distance = tw.div`mx-12`;
const Seat = tw.div`text-xs  text-green-500`;
const Vehicle = tw.div`flex gap-4 items-center p-2 border-b-2`;
const VehicleDetail = tw.div`flex-1`;
const Service = tw.div`font-medium `;
const Time = tw.div`text-xs text-blue-500`;
const Price = tw.div`mr-4 text-sm`;
const VehicleImage = tw.img`w-32 h-24`;
const Wrapper = tw.div`flex-1 relative `;
const Title = tw.div`text-gray-500 text-center text-xs py-2 border border block`;
const VehicleList = tw.div` overflow-y-scroll h-52`;

const Member = tw.div`
 z-index-100 z-50  border-black  h-16  `;

const ConfirmButtonContainer = tw.div` fixed bottom-0 w-full
 border-b`;
const ConfirmButton = tw.div` bg-black text-white text-center text-xl py-3 m-4 rounded  border-t-2 border-gray-600 cursor-pointer `;
