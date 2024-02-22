// import Image from "next/image";
"use client";
import { BackgroundGradientAnimation } from "./components/ui/background-gradient-animation";
import { useState } from "react";
const axios = require("axios");
import { useRouter } from "next/navigation";
export default function Home() {
  const router = useRouter();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const status = await axios.post("http://localhost:3000/api/login", {
      name: name,
      email: email,
      password: password,
    });
    console.log(status.data);
    const checkAuth = await axios.post("http://localhost:3000/api/auth", {});
    console.log(checkAuth.data);
    if (checkAuth.data.status === "success") {
      router.push("/dashboard");
    }
  };
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  return (
    <form onSubmit={handleSubmit}>
      <BackgroundGradientAnimation>
        <div className="flex items-center justify-center w-screen min-h-screen bg-black ">
          <div className="lg:w-1/2 bg-white p-4 z-40  rounded-xl pt-10 aspect-[3/2]">
            <div className="flex justify-center">
              {/* <Image src="pick.svg" width={100} height={80} alt="hello" /> */}
            </div>
            <h1 className="p-2 text-3xl font-medium text-center text-black font-ishtok">
              LOGIN
            </h1>
            <div className="flex justify-center py-4">
              <div className="relative w-2/3 min-w-[200px] h-10 border rounded-md focus-within:border-t-0">
                <input
                  className="peer w-full h-full bg-transparent text-black  font-sans font-normal outline outline-0 focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 border focus:border-2 border-t-transparent focus:border-t-transparent text-sm px-3 py-2.5 rounded-[7px] border-blue-gray-200 focus:border-gray-900"
                  placeholder=" "
                  type="name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                />
                <label className="flex w-full h-full select-none pointer-events-none absolute left-0 font-normal !overflow-visible truncate peer-placeholder-shown:text-blue-gray-500 leading-tight peer-focus:leading-tight peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500 transition-all -top-1.5 peer-placeholder-shown:text-sm text-[11px] peer-focus:text-[11px] before:content[' '] before:block before:box-border before:w-2.5 before:h-1.5 before:mt-[6.5px] before:mr-1 peer-placeholder-shown:before:border-transparent before:rounded-tl-md before:border-t peer-focus:before:border-t-2 before:border-l peer-focus:before:border-l-2 before:pointer-events-none before:transition-all peer-disabled:before:border-transparent after:content[' '] after:block after:flex-grow after:box-border after:w-2.5 after:h-1.5 after:mt-[6.5px] after:ml-1 peer-placeholder-shown:after:border-transparent after:rounded-tr-md after:border-t peer-focus:after:border-t-2 after:border-r peer-focus:after:border-r-2 after:pointer-events-none after:transition-all peer-disabled:after:border-transparent peer-placeholder-shown:leading-[3.75] text-gray-500 peer-focus:text-gray-900 before:border-blue-gray-200 peer-focus:before:!border-gray-900 after:border-blue-gray-200 peer-focus:after:!border-gray-900">
                  Name
                </label>
              </div>
            </div>
            <div className="flex justify-center py-4">
              <div className="relative w-2/3 min-w-[200px] h-10 border rounded-md focus-within:border-t-0">
                <input
                  className="peer w-full h-full bg-transparent text-black  font-sans font-normal outline outline-0 focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 border focus:border-2 border-t-transparent focus:border-t-transparent text-sm px-3 py-2.5 rounded-[7px] border-blue-gray-200 focus:border-gray-900"
                  placeholder=" "
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                />
                <label className="flex w-full h-full select-none pointer-events-none absolute left-0 font-normal !overflow-visible truncate peer-placeholder-shown:text-blue-gray-500 leading-tight peer-focus:leading-tight peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500 transition-all -top-1.5 peer-placeholder-shown:text-sm text-[11px] peer-focus:text-[11px] before:content[' '] before:block before:box-border before:w-2.5 before:h-1.5 before:mt-[6.5px] before:mr-1 peer-placeholder-shown:before:border-transparent before:rounded-tl-md before:border-t peer-focus:before:border-t-2 before:border-l peer-focus:before:border-l-2 before:pointer-events-none before:transition-all peer-disabled:before:border-transparent after:content[' '] after:block after:flex-grow after:box-border after:w-2.5 after:h-1.5 after:mt-[6.5px] after:ml-1 peer-placeholder-shown:after:border-transparent after:rounded-tr-md after:border-t peer-focus:after:border-t-2 after:border-r peer-focus:after:border-r-2 after:pointer-events-none after:transition-all peer-disabled:after:border-transparent peer-placeholder-shown:leading-[3.75] text-gray-500 peer-focus:text-gray-900 before:border-blue-gray-200 peer-focus:before:!border-gray-900 after:border-blue-gray-200 peer-focus:after:!border-gray-900">
                  User Email
                </label>
              </div>
            </div>
            <div className="flex justify-center py-4">
              <div className="relative w-2/3 min-w-[200px] h-10 border rounded-md focus-within:border-t-0">
                <input
                  className="peer w-full h-full bg-transparent text-black  font-sans font-normal outline outline-0 focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 border focus:border-2 border-t-transparent focus:border-t-transparent text-sm px-3 py-2.5 rounded-[7px] border-blue-gray-200 focus:border-gray-900"
                  placeholder=" "
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                />
                <label className="flex w-full h-full select-none pointer-events-none absolute left-0 font-normal !overflow-visible truncate peer-placeholder-shown:text-blue-gray-500 leading-tight peer-focus:leading-tight peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500 transition-all -top-1.5 peer-placeholder-shown:text-sm text-[11px] peer-focus:text-[11px] before:content[' '] before:block before:box-border before:w-2.5 before:h-1.5 before:mt-[6.5px] before:mr-1 peer-placeholder-shown:before:border-transparent before:rounded-tl-md before:border-t peer-focus:before:border-t-2 before:border-l peer-focus:before:border-l-2 before:pointer-events-none before:transition-all peer-disabled:before:border-transparent after:content[' '] after:block after:flex-grow after:box-border after:w-2.5 after:h-1.5 after:mt-[6.5px] after:ml-1 peer-placeholder-shown:after:border-transparent after:rounded-tr-md after:border-t peer-focus:after:border-t-2 after:border-r peer-focus:after:border-r-2 after:pointer-events-none after:transition-all peer-disabled:after:border-transparent peer-placeholder-shown:leading-[3.75] text-gray-500 peer-focus:text-gray-900 before:border-blue-gray-200 peer-focus:before:!border-gray-900 after:border-blue-gray-200 peer-focus:after:!border-gray-900">
                  Password
                </label>
              </div>
            </div>
            <div className="flex justify-center p-5">
              {" "}
              <button
                type="submit"
                // onClick={handleSubmitClick}
                className="px-12 py-4 rounded-full bg-[#F59E0B] font-bold text-white tracking-widest uppercase transform hover:scale-105 hover:bg-[rgb(255,193,85)] transition-colors duration-200"
              >
                Log IN / Sign Up
              </button>
            </div>
          </div>
        </div>
      </BackgroundGradientAnimation>
    </form>
  );
}
