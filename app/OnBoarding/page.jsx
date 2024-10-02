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
  const [loading, setLoading] = useState(false);

  const { setUserInfo } = useUserInfo();
  const [dob, setDob] = useState();

  const router = useRouter();

  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    if (!currentUser) {
      setLoading(true);
      router.push("/Login");
    }
  }, [currentUser, router]);

  useEffect(() => {
    const fetchUsers = async () => {
      const usersRef = collection(firestore, "users");
      const usersSnapshot = await getDocs(usersRef);
      const usersList = usersSnapshot.docs.map((doc) => doc.data());
      const user = usersList.find((user) => user.uid === currentUser.uid);
      if (user) {
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
    <div className="lg:h-screen lg:w-screen py-5 h-screen w-screen ">
      <div className="flex items-center justify-center md:space-x-10 flex-col lg:flex-row space-y-7 mx-auto justify-items-center">
        <h1 className="text-center text-4xl mt-10 mb-10 font-poppins font-bold">
          Welcome to Our App!
        </h1>

        <form
          className="flex flex-col xl:flex-row rounded-lg py-5 px-4 w-11/12 xl:w-1/2  shadow-lg border border-gray-900 font-poppins "
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col  leading-[27px] items-center mx-auto ">
            <input
              className=" p-2 m-2  placeholder:font-poppins outline-none border border-gray-500 rounded-full lg:w-[calc(90% + 3rem)]"
              type="text"
              value={firstName}
              placeholder="First Name"
              onChange={(e) => setFirstName(e.target.value)}
            />
            <input
              className=" p-2 m-2   placeholder:font-poppins outline-none border border-gray-500 rounded-full"
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            <input
              className="  p-2 m-2  placeholder:font-poppins outline-none border border-gray-500 rounded-full"
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
              className=" p-2 m-2 w-full placeholder:font-poppins outline-none border border-gray-500 rounded-full"
              placeholder="Date of Birth"
            />

            <label className=" rounded-full p-2 m-2 cursor-pointer text-center items-center flex justify-center w-full border-black border ">
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
                accept="image/jpeg, image/png, image/jpg, image/gif, image/svg ,image/webp"
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
              className="bg-black text-white w-full rounded-full p-2 m-2 font-poppins"
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
