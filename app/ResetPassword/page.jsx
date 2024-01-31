"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { resetpass } from "../config";

const Page = () => {
  const [username, setUsername] = useState("");

  const handleSubmit = async () => {
    try {
      await resetpass(username);

      alert("Check your email for reset link");
    } catch (error) {
      console.error("Error while sign in Login:", error);
    }
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <div className="  bg-gray-800 rounded-lg py-5 px-4">
        <h1 className="text-4xl font-bold mb-10">Reset Password</h1>
        <input
          className="bg-gray-700 text-white rounded-lg p-2 m-2"
          type="text"
          value={username}
          placeholder="Email"
          onChange={(e) => setUsername(e.target.value)}
        />
        <button
          onClick={() => {
            handleSubmit();
          }}
          className="bg-cyan-500 px-2 py-2 rounded-lg"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default Page;
