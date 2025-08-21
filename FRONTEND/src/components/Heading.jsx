import React from 'react'
import Input from "./Input.jsx"
const Heading = () => {
  return (
    <div className="w-full flex flex-col gap-4 p-6 px-8  ">
      <div className="px-6 p-4">
        <h2 className="text-4xl font-semibold  font-serif ">
          Detect fake banking APKs before they detect you
        </h2>
      </div>
      <div className="flex flex-col md:flex-row lg:flex-row gap-4 justify-around w-full p-3 ">
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
      
      <Input />
    </div>
  );
}

export default Heading
