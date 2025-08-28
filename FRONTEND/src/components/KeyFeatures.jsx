import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import KeyFeature1 from "../assets/keyFeature1.jpg";
import KeyFeature2 from "../assets/keyFeature2.jpg";
import KeyFeature3 from "../assets/keyFeature3.jpg";
import KeyFeature4 from "../assets/keyFeature4.jpg";

const KeyFeatures = () => {
  
  const data = [
    {
      heading: " Instant Detection",
      para: "Quickly uncovers threats to keep your banking exprerience safe and secure.",
    },
    {
      heading: "Your Shield Against Malware Threats",
      para: "SecureAPK has successfully detected over 1 million malware threats, ensuring your financial safety , Join thousands of satisfied users who trust us to protect their sensitive information 98% user satisfaction rate based on recent surveys.",
    },
    {
      heading: "Comprehensive Security",
      para: "Enjoy peace of mind with our thorough analysis of potential risks 95% threats detection accuracy verified by independent test",
    },
    {
      heading: "Verification",
      para: "Validates digital signature and certificates to ensure APK authenticity and integrity",
    },
    {
      heading: "Privacy Protection",
      para: "Your uploaded files are encrypted , analyze securely and automatically delected after scanning",
    },
    {
      heading: "Permission Analysis",
      para: "Analyzes app permissions to identity potentially dangerous or unnecessary access request.",
    },
  ];
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
      <div className="flex flex-col mt-60 gap-4  md:mt-0 lg:mt-0 md:flex-row lg:flex-row p-4 px-6 ">
        {/* image part */}
        <div className="flex flex-col gap-4 mt-20 md:mt-0 lg:mt-0  -translate-y-13  max-w-[550px] ">
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
        <Swiper
          modules={[Autoplay]}
          autoplay={{ delay: 3000, reverseDirection: false }}
          loop={true}
          className="w-full"
        >
          {data.map((data, index) => (
            <SwiperSlide key={index}>
              <div className="flex flex-col w-full  md:max-w-1/2  lg:max-w-1/2 p-1 gap-1 ">
                <div>
                  <h2 className="text-4xl font-semibold  font-serif ">
                    {data.heading}
                  </h2>
                </div>
                <h2 className="p-2 text-2xl text-cyan-600 font-semibold  font-serif ">
                  {data.para}
                </h2>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default KeyFeatures;
