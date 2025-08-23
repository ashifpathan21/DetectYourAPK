import React from "react";
import logo1 from "../assets/logo1.png";
import logo2 from "../assets/logo2.png";
import { useNavigate } from "react-router-dom";
const Navbar = ({ onKeyFeatureClick, onFaqClick, onFooterClick }) => {
  const navigate = useNavigate();
  return (
    <div className="w-screen h-20  shadow-md shadow-cyan-500 p-3 flex justify-between px-1 md:px-5 lg:px-7  items-center ">
      <div
        onClick={() => navigate("/")}
        className="p-3  justify-center items-center"
      >
        <img
          src={logo1}
          className="h-20 object-cover md:h-28 lg:h-28 aspect-square hover:scale-105 hover:translate-1 transition-all duration-200"
        />
      </div>

      {/* menu baar  */}
      <div className="flex  p-0.5 md:p-2 lg:p-3 justify-between items-center gap-1    ">
        <div
          onClick={() => navigate("/")}
          className=" hidden hover:text-blue-500 transition-all duration-500  hover:cursor-pointer items-center justify-center  p-1 md:p-2 lg:p-2 md:flex lg:flex flex-col gap-1 text-md md:text-lg lg:text-lg font-semibold "
        >
          <i className=" ri-home-line"></i>
          <button className="cursor-pointer p-0.5 ">Home</button>
        </div>
        <div onClick={() => 
         { navigate('/')
          onKeyFeatureClick()}} className=" hover:text-blue-500 transition-all duration-500 hover:cursor-pointer items-center justify-center  p-1 md:p-2 lg:p-2 flex flex-col gap-1 text-md md:text-lg lg:text-lg font-semibold ">
          <i className="ri-shield-flash-line"></i>
          <button className="cursor-pointer p-0.5 ">Features</button>
        </div>
        <div onClick={() => navigate("/reports")} className=" hover:text-blue-500 transition-all duration-500 hover:cursor-pointer items-center justify-center  p-1 md:p-2 lg:p-2 flex flex-col gap-1 text-md md:text-lg lg:text-lg font-semibold ">
          <i className="ri-focus-2-line"></i>
          <button className="cursor-pointer p-0.5 ">Scans</button>
        </div>
        <div onClick={() => 
         { navigate('/')
          onFooterClick()}} className=" hover:text-blue-500 transition-all duration-500 hover:cursor-pointer items-center justify-center  p-1 md:p-2 lg:p-2 flex flex-col gap-1 text-md md:text-lg lg:text-lg font-semibold ">
          <i className="ri-question-line"></i>
          <button className="cursor-pointer p-0.5 ">Help</button>
        </div>
        <div onClick={() => 
        {  navigate('/')
          onFaqClick()}} className=" hover:text-blue-500 transition-all duration-500 hover:cursor-pointer items-center justify-center  p-1 md:p-2 lg:p-2 flex flex-col gap-1 text-md md:text-lg lg:text-lg font-semibold ">
          <i className="ri-question-answer-fill"></i>
          <button className="cursor-pointer p-0.5 ">FAQ</button>
        </div>
      </div>

      <div className="p-3 ">
        <button
          onClick={() => navigate("/analyse")}
          className="p-2 font-semibold hover:cursor-pointer hover:shadow-md  transition-all duration-500  hidden md:flex lg:flex shadow-cyan-200  shadow px-4 text-xl bg-[#0651b1] rounded-2xl "
        >
          Scan Now
        </button>
      </div>
    </div>
  );
};

export default Navbar;
