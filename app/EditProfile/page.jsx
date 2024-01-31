"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { FaImage } from "react-icons/fa";
import { onValue, remove, set, update } from "firebase/database";
import { ref } from "firebase/database";
import { database } from "../firebase";
import { useCookies } from "react-cookie";
import { useRouter } from "next/navigation";

const Onboarding = () => {
  const [cookie, setCookie] = useCookies(["user"]);
  const [firstName, setFirstName] = useState(
    cookie.user.firstName !== null ? cookie.user.firstName : ""
  );
  const [lastName, setLastName] = useState(
    cookie.user.lastName !== null ? cookie.user.lastName : ""
  );
  const [bio, setBio] = useState(
    cookie.user.bio !== null ? cookie.user.bio : ""
  );

  const [u, setU] = useState(false);
  const [uid, setUid] = useState();

  const router = useRouter();

  // useEffect(() => {
  //   if (!user.user) {
  //     router.push("/Login");
  //   }
  // });

  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    if (!currentUser) {
      setLoading(true);
      router.push("/Login");
    }
  });
  const handleUpdate = async (e) => {
    const obj = {
      firstName,
      lastName,
      bio,
    };

    e.preventDefault();
    try {
      if (uid === cookie.user.uid) {
        const dbRef = ref(database, "users/" + uid + "/profile");
        await update(dbRef, obj);
        setCookie("user", {
          uid: uid,
          firstName,
          lastName,
          bio,
        });
        router.push("/Dashboard");
      } else {
        router.push("/OnBoarding");
      }
    } catch (error) {
      console.error("Error while onboarding user:", error);
    }
  };

  return (
    <div className="bg-gray-900 text-white lg:h-screen lg:w-screen flex items-center justify-center py-5 h-screen">
      <div className="flex items-center justify-around md:space-x-10 flex-col lg:flex-row  space-y-7">
        <form
          className="flex flex-col items-center justify-center w-4/5 bg-gray-800 rounded-lg py-5 px-4"
          onSubmit={handleUpdate}
        >
          <h1 className="text-4xl font-bold mb-10">OnBoarding</h1>

          <input
            className="bg-gray-700 text-white rounded-lg p-2 m-2 w-full"
            type="text"
            value={firstName}
            placeholder="First Name"
            onChange={(e) => setFirstName(e.target.value)}
          />
          <input
            className="bg-gray-700 text-white rounded-lg p-2 m-2 w-full"
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <input
            className="bg-gray-700 text-white rounded-lg p-2 m-2 w-full"
            type="text"
            placeholder="Bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />

          <label className="bg-gradient-to-r from-purple-600 to-sky-600 text-white rounded-lg p-2 m-2 cursor-pointer text-center items-center flex justify-center w-full">
            <FaImage
              className="
              text-xl mr-2
              "
            />
            Upload Image
            <input
              type="file"
              className="hidden"
              onChange={(e) => {
                e.target.files[0] &&
                  setImage(URL.createObjectURL(e.target.files[0]));
              }}
              accept="image/jpeg, image/png, image/jpg, image/gif, image/svg"
            />
          </label>

          <button
            className="bg-gradient-to-r from-purple-600 to-sky-600 text-white rounded-lg p-2 m-2"
            type="submit"
          >
            Let&apos;s Go
          </button>
        </form>
      </div>
    </div>
  );
};

export default Onboarding;
