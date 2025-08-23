import React from "react";
import HeroSectionImage from "../assets/heroSection.png";
const HeroSection = () => {
  return (
    <div className="w-full flex flex-col md:flex-row lg:flex-row p-6 px-8 min-h-80 ">
      {/* right part */}
      <div className="flex lg:w-1/2 mt-5 md:w-1/2 w-full gap-2  flex-col p-4 px-6 justify-center items-center ">
        <h1 className="text-4xl font-semibold font-serif ">
          Protect Your Finances with SecureAPK Today
        </h1>
        <div className="text-lg font-sans flex flex-col gap-4">
          <div className="flex p-3 gap-2 flex-col justify-center">
            <p>
              SecureAPK swiftly identifies fake banking apps and malware threats
              , ensuring your finacial data remains safe.
            </p>
            <p>
              Exprerience peace of mind with our advanced scanning technology.
            </p>
          </div>

          {/* <button className="p-2 font-semibold hover:cursor-pointer hover:shadow-md  transition-all duration-500 w-40 shadow-cyan-200  shadow px-4 text-xl bg-[#0651b1] rounded-2xl ">
            Check Now
          </button> */}
        </div>
      </div>

      <div className=" lg:w-1/2 md:w-1/2 w-full flex justify-center items-center">
        <img src={HeroSectionImage} className="aspect-square w-95 object-cover" />
      </div>
    </div>
  );
};

export default HeroSection;
