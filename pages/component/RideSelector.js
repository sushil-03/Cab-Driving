import { useState, useEffect } from "react";
import tw from "tailwind-styled-components/dist/tailwind";
import { carList } from "../data/carList";
const RideSelector = ({ pick, drop }) => {
  const [duration, setDuration] = useState(0);
  useEffect(() => {
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
        .then((data) => setDuration(data.routes[0].duration / 50));
    }
  }, [pick, drop]);

  return (
    <Wrapper>
      <Title>Choose a ride, or swipe up for more</Title>
      <CarList>
        {carList.map((car, key) => {
          return (
            <Car key={key}>
              <CarImage src={car.imgUrl}></CarImage>
              <CarDetails>
                <Service>{car.service}</Service>
                <Time>{car.multiplier} min away</Time>
              </CarDetails>
              <Price>{`₹ ` + (car.multiplier * duration).toFixed(2)}</Price>
            </Car>
          );
        })}
      </CarList>
    </Wrapper>
  );
};

export default RideSelector;
const Car = tw.div`flex gap-4 items-center p-2`;
const CarDetails = tw.div`flex-1`;
const Service = tw.div`font-medium `;
const Time = tw.div`text-xs text-blue-500`;
const Price = tw.div`mr-4 text-sm`;
const CarImage = tw.img`

w-20 h-20`;
const Wrapper = tw.div`
flex-1 overflow-scroll relative`;
const Title = tw.div`text-gray-500 text-center text-xs py-2 border border`;
const CarList = tw.div` overflow-y-scroll`;
