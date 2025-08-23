import React from 'react'
import ApkInput from "../components/ApkInput.jsx"
import UrlInput from "../components/UrlInput.jsx";
import Navbar from "../components/Navbar.jsx"
import Footer from "../components/Footer.jsx";
const Analyse = () => {

  return (
    <div className="min-h-screen w-screen h-full   ">
      <Navbar />

      <div className="flex flex-col mt-10 md:flex-row lg:flex-row gap-4  justify-around w-full p-3 ">
        <div className="flex items-center gap-2">
          <i className="rounded-full bg-cyan-400 aspect-square p-2 ri-check-line font-semibold text-3xl"></i>{" "}
          <p className="text-xl font-semibold"> 99.9% Acccuracy</p>
        </div>
        <div className="flex items-center gap-2">
          <i className="rounded-full bg-cyan-400 aspect-square  p-2 ri-thunderstorms-fill font-semibold text-3xl"></i>{" "}
          <p className="text-xl font-semibold"> 30 Second Analysis</p>
        </div>
        <div className="flex items-center gap-2">
          <i className="rounded-full bg-cyan-400 aspect-square p-2 ri-file-chart-fill font-semibold text-3xl"></i>{" "}
          <p className="text-xl font-semibold"> Full APK Report</p>
        </div>
      </div>
      <div className="flex flex-col gap-4 p-3 mb-20 ">
        <ApkInput />

        <div className="flex items-center text-xl  text-gray-500">
          <hr className="flex-1 border-t border-dashed border-gray-400" />
          <span className="px-3">OR</span>
          <hr className="flex-1 border-t border-dashed border-gray-400" />
        </div>

        <UrlInput />
      </div>
      <Footer/>
    </div>
  );
}

export default Analyse
