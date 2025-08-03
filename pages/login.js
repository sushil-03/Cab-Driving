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
      <GradientBackground />
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
  bg-gradient-to-br from-blue-50 via-white to-purple-50
  flex items-center justify-center p-4
  relative overflow-hidden
`;

const GradientBackground = tw.div`
  absolute inset-0
  bg-gradient-to-br from-blue-400/10 via-purple-400/5 to-pink-400/10
  animate-pulse
`;

const ContentContainer = tw.div`
  relative z-10 w-full max-w-md
`;

const LoginCard = tw.div`
  bg-white/80 backdrop-blur-lg
  border border-white/20
  rounded-3xl shadow-2xl
  p-8 space-y-8
  transform transition-all duration-500 ease-out
  hover:shadow-3xl hover:scale-105
`;

const LogoSection = tw.div`
  text-center space-y-2
`;

const Logo = tw.h1`
  text-5xl font-black
  bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600
  bg-clip-text text-transparent
  tracking-tight
`;

const LogoSubtext = tw.p`
  text-gray-500 font-medium text-sm
  tracking-widest uppercase
`;

const WelcomeSection = tw.div`
  text-center space-y-2
`;

const Title = tw.h2`
  text-3xl font-bold text-gray-800
`;

const Subtitle = tw.p`
  text-gray-600 text-lg
`;

const ImageContainer = tw.div`
  relative flex justify-center py-6
`;

const LoginImage = tw.img`
  w-48 h-48 object-contain
  filter drop-shadow-2xl
  transform transition-transform duration-700 ease-out
  hover:scale-110 hover:rotate-3
`;

const ImageGlow = tw.div`
  absolute inset-0
  bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20
  rounded-full blur-3xl
  animate-pulse
`;

const ButtonContainer = tw.div`
  space-y-4
`;

const SignInButton = tw.button`
  w-full bg-gradient-to-r from-blue-600 to-purple-600
  hover:from-blue-700 hover:to-purple-700
  text-white font-semibold py-4 px-6
  rounded-2xl shadow-lg
  flex items-center justify-center gap-3
  transform transition-all duration-300 ease-out
  hover:scale-105 hover:shadow-xl
  disabled:opacity-50 disabled:cursor-not-allowed
  disabled:hover:scale-100
  group
`;

const GoogleIcon = tw.div`
  w-6 h-6 bg-white rounded-full p-1
  group-hover:rotate-12 transition-transform duration-300
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
