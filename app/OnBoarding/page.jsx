"use client";
import { useEffect, useState } from "react";

import { FaImage } from "react-icons/fa";
import { doc, setDoc } from "firebase/firestore";
import { useCookies } from "react-cookie";
import { useRouter } from "next/navigation";
import { auth } from "../firebase";
import { storage, firestore } from "../firebase";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Onboarding = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [bio, setBio] = useState("");
  const [image, setImage] = useState(null);
  const [cookie, setCookie] = useCookies(["user"]);
  const [u, setU] = useState(false);
  const [uid, setUid] = useState();
  const [dob, setDob] = useState();

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

  const handleSubmit = async (e) => {
    // const obj = {
    //   uid: auth.currentUser.uid,
    //   firstName: firstName,
    //   lastName: lastName,
    //   bio: bio,
    //   image: image,
    // };

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
            }).then(() => {
              router.push("/CreateRoom");
            });
          } catch (e) {
            console.error("onboarding.jsx while create user profile", e);
          }
        });
      });
    }
  };

  // try {
  //   const docRef = await addDoc(collection(firestore, "users"), obj);
  //   console.log("Document written with ID: ", docRef.id);
  //   setCookie("user", {
  //     uid: uid,
  //     firstName,
  //     lastName,
  //     bio,
  //   });
  //   router.push("/CreateRoom");
  // } catch (error) {
  //   console.error("Error while onboarding user:", error);
  // }

  return (
    <div className="lg:h-screen lg:w-screen  py-5 h-screen w-screen">
      <h1 className="text-center text-4xl mt-10 mb-10 font-cal">
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
              className="border-b-2 border-b-gray-900 p-2 m-2 w-full placeholder:font-cal outline-none focus:border-b-4 focus:border-b-gray-900"
              type="text"
              value={firstName}
              placeholder="First Name"
              onChange={(e) => setFirstName(e.target.value)}
            />
            <input
              className="border-b-2 border-b-gray-900 p-2 m-2 w-full  placeholder:font-cal outline-none focus:border-b-4 focus:border-b-gray-900"
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            <input
              className="border-b-2 border-b-gray-900  p-2 m-2 w-full  placeholder:font-cal outline-none focus:border-b-4 focus:border-b-gray-900"
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
              className="border border-gray-900 rounded-lg p-2 m-2 w-full placeholder:font-cal outline-none focus:border-b-4 focus:border-b-gray-900"
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
                  className="rounded-full w-24 h-24"
                  alt="not found"
                />
              </div>
            )}

            <button
              className="bg-black text-white w-full rounded-lg p-2 m-2 font-cal"
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
