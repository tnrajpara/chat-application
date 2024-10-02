"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCookies } from "react-cookie";
import { signIn } from "../config";
import Link from "next/link";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { FcGoogle } from "react-icons/fc";
import { signInWithPopup } from "firebase/auth";
import { UserContext } from "../context/UserContext";
import { GoogleAuthProvider } from "firebase/auth";
import { auth } from "../firebase";

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
      router.push("/OnBoarding");
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;

      console.log(errorCode, errorMessage, username);
    }
  };
  return (
    <div>
      <div className=" bg-white/20 text-black h-screen w-screen justify-center items-center flex isolate  aspect-video">
        <form
          className="flex flex-col xl:flex-row items-center justify-center gap-10 lg:w-1/4 w-full mx-auto lg:text-xl border border-black   border-l-[1rem] border-l-gray-800 rounded-2xl px-10 py-4 mt-10  ml-3 mb-3  my-10"
          onSubmit={handleSubmit}
        >
          <img src="/login.jpeg" alt="" className="lg:h-1/2 lg:w-1/2" />
          <div className="flex flex-col ">
            <h1 className="text-5xl font-bold mb-10 font-poppins text-center">
              Login
            </h1>
            <input
              className=" border border-gray-500 rounded-full outline-none active:border active:border-gray-700 p-2 m-2 w-full "
              type="text"
              value={username}
              placeholder="Username"
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              className="border border-gray-500 rounded-full outline-none active:border active:border-gray-700 p-2 m-2 w-full"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              className="font-poppins rounded-full p-2 m-2 w-full text-center bg-black text-white"
              type="submit"
            >
              Login
            </button>
            <button
              className="flex font-poppins justify-center items-center rounded-full p-2 m-2 border border-black w-full"
              onClick={() => {
                signWithPop();
              }}
            >
              <FcGoogle className="mr-4" />
              Continue With Google
            </button>
            <Link
              href={"/Register"}
              className="underline w-full text-center text-gray-900 font-poppins"
            >
              Register
            </Link>

            <Link href={"/ResetPassword"} className="text-center font-poppins">
              Forgot password ?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
