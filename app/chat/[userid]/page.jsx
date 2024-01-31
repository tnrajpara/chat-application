"use client";
import { useParams } from "next/navigation";
import React from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { firestore } from "../../firebase";
import { getDoc, doc } from "firebase/firestore";

const Page = () => {
  const [receiver, setReceiver] = React.useState([]);
  const [pending, setPending] = React.useState(true);
  const [inputMessage, setInputMessage] = React.useState("");

  const pathName = useParams().userid;

  React.useEffect(() => {
    const fetchUser = async () => {
      const userRef = doc(firestore, "users", pathName);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        setReceiver(userSnap.data());
        setPending(false);
      } else {
        console.log("No such user!");
      }
    };
    fetchUser();
  }, [pathName]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleMessageSubmit(e);
    }
  };

  const handleMessageSubmit = async (e) => {
    e.preventDefault();
  };

  return (
    <div className=" lg:h-screen lg:w-screen bg-[#f4f4f4] font-cal">
      <div className="flex justify-start items-center space-x-6 bg-[#d4d3d3] py-5">
        <IoMdArrowRoundBack className="text-2xl ml-3 text-center" />

        <div className="flex justify-center items-center">
          <img src={receiver.image} alt="" className="rounded-full w-12 h-12" />
          <span className="text-center">
            {receiver.firstName} {receiver.lastName}
          </span>
        </div>
      </div>
      <div className="p-4 flex items-center">
        <form className="w-full flex" onSubmit={() => handleMessageSubmit()}>
          <input
            type="text"
            placeholder="Type your message..."
            className="flex-grow  p-2 rounded-l-md outline-none border-black"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            type="submit"
            className=" px-4 py-2 rounded-md ml-2 border-b-4 border-b-gray-900 outline-4 border border-black bg-gray-800 text-gray-100 hover:cursor-pointer"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Page;
