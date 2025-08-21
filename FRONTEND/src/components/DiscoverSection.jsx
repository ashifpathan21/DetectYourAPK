import React from "react";
import Cart from "./Cart.jsx";
import Discover1 from "../assets/discover1.jpg";
import Discover2 from "../assets/discover2.jpg";
import Discover3 from "../assets/discover3.jpg";
const data = [
  {
    img: Discover1,
    text1:
      "A seamless process to ensure your banking apps are safe and secure.",
    text2:
      "SecureAPK scans and identifies potential threats in seconds, keeping your data safe.",
    buttonIcon: "ri-qr-scan-line",
    buttonText: "Scan",
  },
  {
    img: Discover2,
    text1:
      "Receive instant alerts for any suspicious banking application detected.",
    text2:
      "Stay informed and take action with real-time notifications from SecureAPK.",
    buttonIcon: "ri-alert-fill",
    buttonText: "Alert",
  },
  {
    img: Discover3,
    text1: "Enjoy peace of mind with our comprehensive security analysise.",
    text2: "SecureAPK provides detailed insights into the safety of your apps.",
    buttonIcon: "ri-file-edit-fill",
    buttonText: "Learn More",
  },
];
const DiscoverSection = () => {
  return (
    <div className="flex flex-col gap-6 ">
      <h2 className="text-center text-4xl gap-3 flex justify-center items-center font-semibold font-serif ">
        <i className="ri-search-eye-line"></i> 
        Discover
      </h2>
      <h2 className="text-center p-3 text-3xl font-semibold font-serif ">
        How SecureAPK safeguards your financial data effortlessly and
        effectively.
      </h2>

      <div className="grid grid-cols-1 space-x-5 space-y-5 md:grid-cols-3 lg:grid-cols-3 p-3 ">
        {data?.map((data, i) => (
          <Cart key={i} data={data} />
        ))}
      </div>
    </div>
  );
};

export default DiscoverSection;
