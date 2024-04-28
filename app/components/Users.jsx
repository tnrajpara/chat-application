"use client";
import React from "react";
import Link from "next/link";

const Users = ({ users, personal }) => {
  return (
    <div>
      {users.map((user) => {
        if (
          user.image === personal.image ||
          user.firstName === personal.firstName
        ) {
          return;
        }
        return (
          <div
            class="w-full max-w-sm border px-5 rounded-full py-5 lg:px-10 lg:py-10 border-black shadow bg-gray-50  mt-7 "
            key={user.uid}
          >
            <div class="flex flex-col items-center py-5 px-4 pt-4 ">
              <img
                class="w-24 h-24 mb-5 lg:mb-7 rounded-2xl shadow-lg object-cover"
                src={user.image}
                alt={user.firstName}
              />
              <h5 class="mb-1 text-xl font-medium  text-black">
                {user.firstName} {user.lastName}
              </h5>
              <span class="text-sm  text-gray-400 first-letter:capitalize">
                {user.bio}
              </span>
              <div class="flex mt-4 md:mt-6">
                <a
                  href="#"
                  class="inline-flex items-center px-4 py-2 text-sm font-medium text-center  bg-gray-50 border border-black rounded-full  text-black"
                >
                  <img src="/F_Request.svg" alt="" className="w-5   h-5" />
                </a>
                {personal.uid === "" && user.uid === "" ? (
                  <div></div>
                ) : (
                  <Link
                    href={`chats/${personal.uid}-${user.uid}`}
                    class="py-2 px-4 ms-2 text-sm font-medium text-gray-50 focus:outline-none  rounded-full border border-gray-200   bg-gray-800 "
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
