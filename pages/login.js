import React, { useEffect } from "react";
import tw from "tailwind-styled-components/dist/tailwind";
import { useRouter } from "next/router";
import { signInWithPopup, onAuthStateChanged } from "firebase/auth";
import { auth, provider } from "../firebase";

const Login = () => {
  const router = useRouter();
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push("/");
      }
    });
  }, [router]);

  return (
    <Wrapper>
      <Logo>Pahiya</Logo>
      <Title>Login to access your account</Title>
      <LoginImage src="/login.png" />
      <SignInButton onClick={() => signInWithPopup(auth, provider)}>
        Sign in with Google
        <GoogleImage src="/google.png" />
      </SignInButton>
    </Wrapper>
  );
};

export default Login;
const Wrapper = tw.div`h-screen w-screen bg-gray-200 p-4`;
const Logo = tw.div`text-5xl font-bold p-3`;
const Title = tw.div`text-center mt-5 font-semibold text-xl text-gray-600`;
const LoginImage = tw.img`m-auto mt-5`;
const SignInButton = tw.button`bg-black text-white p-3  text-lg w-full mt-4 flex justify-center gap-5 items-center`;
const GoogleImage = tw.img`w-10 h-10`;
