"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const Users = ({ users, personal }) => {
  const [initialRender, setInitialRender] = useState(true);

  useEffect(() => {
    setInitialRender(false);
  }, []);

  return (
    <div className="grid lg:grid-cols-4 md:grid-cols-2">
      {users.map((user) => {
        if (!initialRender && user.uid === personal.uid) {
          return null;
        }
        return (
          <div
            className="border-2 px-5 hover:rounded-lg  py-5  border-black   mt-7 flex mx-auto justify-center 
"
            key={user.uid}
          >
            <div className="py-5 px-4 pt-4 flex items-center flex-col">
              <img
                className=" mb-5 lg:mb-7 rounded-2xl shadow-lg lg:w-44 lg:h-44  w-[calc(50% + 2rem)] h-[calc(50% + 2rem)]"
                src={user.image}
                alt={user.firstName}
              />
              <h5 className="mb-1 text-xl  text-black font-semibold capitalize">
                {user.firstName} {user.lastName}
              </h5>
              <span className="text-sm text-gray-4  00 first-letter:capitalize">
                {user.bio}
              </span>
              <div className="flex mt-4 md:mt-6">
                <a
                  href="#"
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-center bg-gray-50 border border-black rounded-full text-black"
                >
                  <img src="/F_Request.svg" alt="" className="w-5 h-5" />
                </a>
                {personal.uid === "" && user.uid === "" ? (
                  <div></div>
                ) : (
                  <Link
                    href={`chats/${personal.uid}-${user.uid}`}
                    className="py-2 px-4 ms-2 text-sm font-medium text-gray-50 focus:outline-none rounded-full border border-gray-200 bg-gray-800"
                  >
                    Message
                  </Link>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Users;
