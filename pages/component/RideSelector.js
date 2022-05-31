import React from "react";
import tw from "tailwind-styled-components/dist/tailwind";
const RideSelector = () => {
  return (
    <Wrapper>
      <Title>Choose a ride, or swipe up for more</Title>
      <CarList>
        <Car>
          <CarImage src="/bike.png"></CarImage>
          <CarDetails>
            <Service>Lamborgini Adventor</Service>
            <Time>5 min away</Time>
          </CarDetails>
          <Price>$1</Price>
        </Car>
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
flex-1`;
const Title = tw.div`text-gray-500 text-center text-xs py-2 border border`;
const CarList = tw.div``;
