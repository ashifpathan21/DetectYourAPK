import React, { useContext, useEffect, useState } from "react";
import Navbar from "../components/Navbar.jsx"
import HeroSection from "../components/HeroSection.jsx";
import KeyFeatures from "../components/KeyFeatures.jsx";
import DiscoverSection from "../components/DiscoverSection.jsx";
import Heading from "../components/Heading.jsx";
import Faq from "../components/Faq.jsx";
import Footer from "../components/Footer.jsx";

const Home = () => {


  return (
    <div className="min-h-screen  h-full w-screen overflow-x-hidden  ">
      <Navbar />
      <Heading />
      <HeroSection />
      <KeyFeatures />
      <DiscoverSection />
      <Faq />
      <Footer />
    </div>
  );
};

export default Home;
