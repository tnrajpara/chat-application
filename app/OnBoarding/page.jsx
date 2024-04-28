"use client";
import { useEffect, useState } from "react";

import { FaImage } from "react-icons/fa";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { auth } from "../firebase";
import { storage, firestore } from "../firebase";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useUserInfo } from "../context/UserInfo";
import { collection, getDocs } from "firebase/firestore";

const Onboarding = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [bio, setBio] = useState("");
  const [image, setImage] = useState(null);
  const [existingUser, setExistingUser] = useState(false);

  const { setUserInfo } = useUserInfo();
  const [dob, setDob] = useState();

  const router = useRouter();

  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    if (!currentUser) {
      setLoading(true);
      router.push("/Login");
    }
  });

  useEffect(() => {
    const fetchUsers = async () => {
      const usersRef = collection(firestore, "users");
      const usersSnapshot = await getDocs(usersRef);
      const usersList = usersSnapshot.docs.map((doc) => doc.data());
      const user = usersList.find((user) => user.uid === currentUser.uid);
      if (user) {
        setExistingUser(true);
        router.push("/Dashboard");
      }
    };
    fetchUsers();
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const date = new Date().getTime();
    if (image) {
      const storageRef = ref(storage, `${firstName + date}`);

      await uploadBytesResumable(storageRef, image).then(() => {
        getDownloadURL(storageRef).then(async (downloadUrl) => {
          try {
            await setDoc(doc(firestore, "users", auth.currentUser.uid), {
              uid: auth.currentUser.uid,
              firstName,
              lastName,
              bio,
              image: downloadUrl,
              dob,
            })
              .then(() => {
                setUserInfo({
                  uid: auth.currentUser.uid,
                  firstName,
                  lastName,
                  bio,
                  image: downloadUrl,
                  dob,
                });
              })
              .then(() => {
                router.push("/Dashboard");
              });
          } catch (e) {
            console.error("onboarding.jsx while create user profile", e);
          }
        });
      });
    }
  };

  return (
    <div className="lg:h-screen lg:w-screen  py-5 h-screen w-screen">
      <h1 className="text-center text-4xl mt-10 mb-10 font-poppins">
        Welcome to Our App!
      </h1>

      <div className="flex items-center justify-between md:space-x-10 flex-col lg:flex-row  space-y-7">
        <form
          className="flex flex-col xl:flex-row  rounded-lg py-5 px-4"
          onSubmit={handleSubmit}
        >
          <img src="/bg.jpg" className="lg:h-1/2 lg:w-1/2 " alt="not found" />
          <div className="flex flex-col w-3/4 h-1/2 leading-[27px] items-center place-items-center justify-center mx-auto lg:w-3/4">
            <input
              className="border-b-2 border-b-gray-900 p-2 m-2 w-full placeholder:font-poppins outline-none focus:border-b-4 focus:border-b-gray-900"
              type="text"
              value={firstName}
              placeholder="First Name"
              onChange={(e) => setFirstName(e.target.value)}
            />
            <input
              className="border-b-2 border-b-gray-900 p-2 m-2 w-full  placeholder:font-poppins outline-none focus:border-b-4 focus:border-b-gray-900"
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            <input
              className="border-b-2 border-b-gray-900  p-2 m-2 w-full  placeholder:font-poppins outline-none focus:border-b-4 focus:border-b-gray-900"
              type="text"
              placeholder="Bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
            <input
              type="date"
              name=""
              id=""
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="border border-gray-900 rounded-lg p-2 m-2 w-full placeholder:font-poppins outline-none focus:border-b-4 focus:border-b-gray-900"
              placeholder="Date of Birth"
            />

            <label className=" rounded-lg p-2 m-2 cursor-pointer text-center items-center flex justify-center w-full border-black border ">
              <FaImage
                className="
              text-xl mr-2
              "
              />
              Upload Image
              <input
                type="file"
                className="hidden"
                onChange={(e) => setImage(e.target.files[0])}
                accept="image/jpeg, image/png, image/jpg, image/gif, image/svg"
              />
            </label>

            {/* show uploaded image preview  */}

            {image && (
              <div className="flex justify-center items-center">
                <img
                  src={URL.createObjectURL(image)}
                  className="rounded-md w-32 h-32 object-cover"
                  alt="not found"
                />
              </div>
            )}

            <button
              className="bg-black text-white w-full rounded-lg p-2 m-2 font-poppins"
              type="submit"
            >
              Let&apos;s Go
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Onboarding;
