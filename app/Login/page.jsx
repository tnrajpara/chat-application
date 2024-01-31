"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCookies } from "react-cookie";
import { signIn } from "../config";
import Link from "next/link";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { FcGoogle } from "react-icons/fc";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [cookie, setCookie] = useCookies(["user"]);
  const [user, setUser] = useState({});
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
      const user = await signIn(username, password);
      if (user) {
        router.push("/OnBoarding");
        console.log(user.uid);
        // setCookie("userId", user.uid);
      }
    } catch (error) {
      console.error("Error while sign in Login:", error);
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
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      console.log(errorCode, errorMessage, email);
    }
  };

  return (
    <div>
      <div className="bg-white text-black h-screen w-screen justify-center items-center">
        <form
          className="flex items-center gap-10 lg:w-4/5 w-full mx-auto lg:text-xl border border-black border-b-[1rem] border-b-gray-800  border-l-[1rem] border-l-gray-800 rounded-2xl px-10 py-4 mt-10 my-10"
          onSubmit={handleSubmit}
        >
          <img src="/login.jpeg" alt="" className="lg:h-1/2 lg:w-1/2" />
          <div className="flex flex-col w-1/2">
            <h1 className="text-5xl font-bold mb-10 font-cal text-center">
              Login
            </h1>
            <input
              className=" rounded-lg p-2 m-2 w-full border border-black placeholder:font-cal"
              type="text"
              value={username}
              placeholder="Username"
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              className="rounded-lg p-2 m-2 w-full border border-black placeholder:font-cal"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              className="font-cal rounded-lg p-2 m-2 w-full text-center bg-black text-white"
              type="submit"
            >
              Login
            </button>
            <button
              className="flex font-cal justify-center items-center rounded-lg p-2 m-2 border border-black w-full"
              onClick={() => {
                signWithPop();
              }}
            >
              <FcGoogle className="mr-4" />
              Continue With Google
            </button>
            <Link
              href={"/Register"}
              className="underline w-full text-center text-gray-900 font-cal"
            >
              Register
            </Link>

            <Link href={"/ResetPassword"} className="text-center font-cal">
              Forgot password ?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
