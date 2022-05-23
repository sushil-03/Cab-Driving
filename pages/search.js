import tw from "tailwind-styled-components/dist/tailwind";
const Search = () => {
  return (
    <Wrapper>
      <ButtonContainer>
        <BackButton>Icon</BackButton>
      </ButtonContainer>

      <InputContainer>
        <FromToIcons>
          <Circle></Circle>
          <Line></Line>
          <Square></Square>
        </FromToIcons>
      </InputContainer>
    </Wrapper>
  );
};

export default Search;
const InputContainer = tw.div`
`;
const FromToIcons = tw.div``;

const Circle = tw.div``;
const Line = tw.div``;
const Square = tw.div``;
const Wrapper = tw.div`
    bg-gray-200 h-screen
`;
const ButtonContainer = tw.div``;
const BackButton = tw.div`
h-10 bg-white px-4 py-2 `;
