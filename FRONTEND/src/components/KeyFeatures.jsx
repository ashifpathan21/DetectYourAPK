import React from "react";
import KeyFeature1 from "../assets/keyFeature1.jpg";
import KeyFeature2 from "../assets/keyFeature2.jpg";
import KeyFeature3 from "../assets/keyFeature3.jpg";
import KeyFeature4 from "../assets/keyFeature4.jpg";

const KeyFeatures = () => {
  return (
    <div className="p-6 px-8 flex flex-col gap-15 ">
      <div className="flex flex-col md:flex-row lg:flex-row p-4 px-6 ">
        <div className="flex flex-col gap-1 ">
          <h2 className="text-4xl font-semibold  font-serif ">
            Key Features of SecureAPK
          </h2>
          <h2 className="text-4xl font-semibold  font-serif ">
            You Need to Know
          </h2>
          <p className="text-lg px-5 p-3">
            SecureAPK offers real-time scanning to detect threats instantly. Our
            comprehensive security analysis ensure your financial data remains
            protected
          </p>
        </div>

        {/* image part */}
        <div className="relative w-full md:w-10/12 lg:w-10/12 p-3 ">
          <img
            src={KeyFeature1}
            loading="lazy"
            className="object-cover hover:shadow-lg rounded-4xl shadow-md  transition-all duration-1000 shadow-cyan-700 absolute h-44 top-0 left-0"
          />
          <img
            src={KeyFeature2}
            loading="lazy"
            className="object-cover hover:shadow-lg rounded-4xl shadow-md  transition-all duration-1000 shadow-cyan-700 absolute h-44 md:top-25 md:left-60 lg:top-25 top-40 left-10  lg:left-60"
          />
        </div>
      </div>
      <div className="flex flex-col mt-60 md:mt-0 lg:mt-0 md:flex-row lg:flex-row p-4 px-6 ">
        {/* image part */}
        <div className="hidden  md:flex lg:flex flex-col gap-4 -translate-y-13  w-full md:w-1/2 lg:w-1/2  ">
          <img
            src={KeyFeature4}
            loading="lazy"
            className="object-cover hover:shadow-lg rounded-4xl shadow-md  transition-all duration-500 shadow-cyan-700  h-40 w-90  "
          />
          <img
            src={KeyFeature3}
            loading="lazy"
            className="object-cover hover:shadow-lg rounded-4xl shadow-md  transition-all duration-500 shadow-cyan-700  h-40 w-90  "
          />
        </div>
        <div className="flex flex-col p-2 gap-1 ">
          <h2 className="text-4xl font-semibold  font-serif ">
            Instant Detection
          </h2>
          <h2 className="p-2 text-2xl text-cyan-600 font-semibold  font-serif ">
            Quickly uncovers threats to keep your banking exprerience safe and
            secure.
          </h2>
        </div>
      </div>
    </div>
  );
};

export default KeyFeatures;
