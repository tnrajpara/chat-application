"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../firebase";
import Link from "next/link";
import { createUser } from "../config";
import { FcGoogle } from "react-icons/fc";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [usernameExists, setUsernameExists] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const { currentUser } = useContext(AuthContext);

  const router = useRouter();

  useEffect(() => {
    if (currentUser) {
      router.push("/OnBoarding");
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (password === confirmPassword && password.length >= 6) {
        const user = await createUser(email, password);
        console.log(user);
        if (user) {
          router.push("/Login");
        } else {
          setShowErrorMessage(true);
        }
      }
    } catch (err) {
      console.log("Error creating user :: handSubmit-register.jsx", err);
    }
  };

  const signWithPop = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const googleAuth = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(googleAuth);
      const token = credential.accessToken;
      const user = googleAuth.user;
      console.log(
        "User info from google :: handleSubmit-register.jsx",
        user,
        token
      );
      router.push("/OnBoarding");
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;

      const credential = GoogleAuthProvider.credentialFromError(error);
      console.log(errorCode, errorMessage, email);
      console.log(credential);
    }
  };

  return (
    <div className=" bg-white text-black h-screen w-screen justify-center items-center">
      <form
        className="flex flex-col xl:flex-row items-center justify-center gap-10 lg:w-4/5 w-full mx-auto lg:text-xl border border-black   border-l-[1rem] border-l-gray-800 rounded-2xl px-10 py-4 mt-10  ml-3 mb-3  my-10"
        onSubmit={handleSubmit}
      >
        <img src="/register.jpeg" alt="" className="lg:h-1/2 lg:w-1/2" />
        <div className="flex flex-col w-full">
          <h1 className="text-5xl font-bold mb-10 font-poppins">Register</h1>
          <input
            className="border border-black rounded-lg outline-none active:border active:border-gray-800 p-2 m-2 w-full placeholder:font-poppins"
            type="text"
            value={email}
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="border border-black rounded-lg p-2 m-2 ouline-none active:border active:border-gray-800 w-full placeholder:font-poppins"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            className="border border-black rounded-lg p-2 m-2 outline-none active:border active:border-gray-800 w-full placeholder:font-poppins"
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button
            className=" bg-black text-white rounded-lg p-2 m-2 w-full font-poppins"
            type="submit"
          >
            Register
          </button>
          <button
            className="flex font-poppins justify-center items-center rounded-lg p-2 m-2 border border-black w-full"
            onClick={() => {
              signWithPop();
            }}
          >
            <FcGoogle className="mr-4" />
            Continue With Google
          </button>

          {/* Display an error message if username exists */}
          {showErrorMessage && (
            <p className="text-red-500 mt-2">
              Username already exists. Please choose a different username.
            </p>
          )}
          <Link
            href="/Login"
            className="text-lg text-center font-poppins underline rounded-lg p-2 m-2 "
          >
            Login
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Register;
