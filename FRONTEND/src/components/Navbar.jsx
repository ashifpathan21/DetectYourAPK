import React, { useEffect, useRef, useState } from "react";
import logo1 from "../assets/logo.png";
import { useNavigate } from "react-router-dom";

const Navbar = ({ onKeyFeatureClick, onFaqClick, onFooterClick }) => {
  const [visible, setVisible] = useState(true);
  const lastY = useRef(0);
  const ticking = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    lastY.current = window.scrollY;

    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;

      requestAnimationFrame(() => {
        const curr = window.scrollY;
        const delta = curr - lastY.current;
        const threshold = 8;

        if (curr <= 0) {
          if (!visible) setVisible(true);
        } else if (Math.abs(delta) > threshold) {
          if (delta > 0 && visible) setVisible(false);
          else if (delta < 0 && !visible) setVisible(true);
        }

        lastY.current = curr;
        ticking.current = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [visible]);

  return (
    <div
      className={`fixed top-0 p-3 left-0 right-0 z-50
                  bg-transparent backdrop-blur-sm
                  transition-transform duration-500 will-change-transform
                  flex justify-around items-center h-20 w-full
                  ${visible ? "translate-y-0" : "-translate-y-full"}`}
    >
      <div onClick={() => navigate("/")} className="p-2 relative">
        <img
          src={logo1}
          className="h-20 object-fit md:h-24 text-white lg:h-24 hover:scale-105 transition-all duration-200"
          alt="logo"
        />
        <h1 className='absolute top-12  left-15 text-2xl font-bold'>Secure</h1>
      </div>

      {/* menu bar with tooltips */}
      <div className="flex rounded-full moving-shadow px-8 max-w-[500px] w-full md:p-2 lg:p-2 justify-around items-center gap-2">
        {/* Home */}
        <div
          onClick={() =>{ navigate("/")
            window.scrollTo({
              top:0,
              behavior:"smooth"
            })}
          }
          className="relative group hidden md:flex lg:flex cursor-pointer p-2 text-lg font-semibold"
        >
          <i className="ri-home-line hover:text-cyan-500 transition-all duration-500"></i>
          <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs bg-cyan-600 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition duration-300">
            Home
          </span>
        </div>

        {/* Features */}
        <div
          onClick={() => {
            navigate("/");
            onKeyFeatureClick && onKeyFeatureClick();
          }}
          className="relative group cursor-pointer p-2 text-lg font-semibold"
        >
          <i className="ri-shield-flash-line hover:text-cyan-500 transition-all duration-500"></i>
          <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs bg-cyan-600 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition duration-300">
            Features
          </span>
        </div>

        {/* Scan */}
        <div
          onClick={() => navigate("/reports")}
          className="relative group cursor-pointer p-2 text-lg font-semibold"
        >
          <i className="ri-search-line hover:text-cyan-500 transition-all duration-500"></i>
          <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs bg-cyan-600 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition duration-300">
            Reports
          </span>
        </div>

        {/* Help */}
        <div
          onClick={() => {
            navigate("/");
            onFooterClick && onFooterClick();
          }}
          className="relative group cursor-pointer p-2 text-lg font-semibold"
        >
          <i className="ri-question-line hover:text-cyan-500 transition-all duration-500"></i>
          <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs bg-cyan-600 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition duration-300">
            Help
          </span>
        </div>

        {/* FAQs */}
        <div
          onClick={() => {
            navigate("/");
            onFaqClick && onFaqClick();
          }}
          className="relative group cursor-pointer p-2 text-lg font-semibold"
        >
          <i className="ri-question-answer-fill hover:text-cyan-500 transition-all duration-500"></i>
          <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs bg-cyan-600 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition duration-300">
            FAQs
          </span>
        </div>
      </div>

      <div className="p-3">
        <button
          onClick={() => navigate("/analyse")}
          className="p-2 font-semibold hidden md:flex lg:flex hover:shadow-md transition-all duration-500 shadow-cyan-200 shadow px-4 text-xl rounded-2xl"
        >
          Scan Now
        </button>
      </div>
    </div>
  );
};

export default Navbar;
