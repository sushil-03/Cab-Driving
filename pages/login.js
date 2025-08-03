import React, { useEffect, useState } from "react";
import tw from "tailwind-styled-components/dist/tailwind";
import { useRouter } from "next/router";
import { signInWithPopup, onAuthStateChanged } from "firebase/auth";
import { auth, provider } from "../firebase";

const Login = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push("/");
      }
    });
  }, [router]);

  const handleSignIn = async () => {
    setIsLoading(true);
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Sign in error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Wrapper>
      <ContentContainer>
        <LoginCard>
          <LogoSection>
            <Logo>Pahiya</Logo>
            <LogoSubtext>Ride in Style</LogoSubtext>
          </LogoSection>

          <WelcomeSection>
            <Title>Welcome Back</Title>
            <Subtitle>Sign in to continue your journey</Subtitle>
          </WelcomeSection>

          <ImageContainer>
            <LoginImage src="/login.png" alt="Login illustration" />
            <ImageGlow />
          </ImageContainer>

          <ButtonContainer>
            <SignInButton
              onClick={handleSignIn}
              disabled={isLoading}
              className={isLoading ? 'loading' : ''}
            >
              {isLoading ? (
                <>
                  <LoadingSpinner />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <GoogleIcon>
                    <GoogleImage src="/google.png" alt="Google" />
                  </GoogleIcon>
                  <span>Continue with Google</span>
                </>
              )}
            </SignInButton>

            <SecurityNote>
              <LockIcon>🔒</LockIcon>
              <span>Your data is secure and encrypted</span>
            </SecurityNote>
          </ButtonContainer>
        </LoginCard>
      </ContentContainer>
    </Wrapper>
  );
};

export default Login;

const Wrapper = tw.div`
  min-h-screen w-full
  flex items-center justify-center p-4
`;



const ContentContainer = tw.div`
  relative z-10 w-full max-w-md
`;

const LoginCard = tw.div`
  bg-white 
  border border-gray-200
  rounded-2xl shadow-lg
  p-8 space-y-6
  -ml-1 flex flex-col justify-center items-center
`;

const LogoSection = tw.div`
  text-center space-y-3
`;

const Logo = tw.h1`
  text-4xl font-bold text-gray-800
  tracking-tight
`;

const LogoSubtext = tw.p`
  text-gray-500 font-medium text-sm
  tracking-wide
`;

const WelcomeSection = tw.div`
  text-center space-y-2
`;

const Title = tw.h2`
  text-2xl font-semibold text-gray-800
`;

const Subtitle = tw.p`
  text-gray-600 text-base
`;

const ImageContainer = tw.div`
  flex justify-center py-4
`;

const LoginImage = tw.img`
  w-40 h-40 object-contain
  filter drop-shadow-lg
`;

const ImageGlow = tw.div`
  hidden
`;

const ButtonContainer = tw.div`
  space-y-4 w-full
`;

const SignInButton = tw.button`
  w-full bg-blue-600
  text-white font-medium py-3 px-6
  rounded-lg shadow-md
  flex items-center justify-center gap-3
  transition-colors duration-200
  disabled:opacity-50 disabled:cursor-not-allowed
  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
`;

const GoogleIcon = tw.div`
  w-5 h-5 bg-white rounded-full p-1
`;

const GoogleImage = tw.img`
  w-full h-full object-contain
`;

const LoadingSpinner = tw.div`
  w-6 h-6 border-2 border-white/30 border-t-white
  rounded-full animate-spin
`;

const SecurityNote = tw.div`
  flex items-center justify-center gap-2
  text-sm text-gray-500 font-medium
`;

const LockIcon = tw.span`
  text-green-500
`;
