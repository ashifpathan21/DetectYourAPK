import React, { useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import Navbar from "../components/Navbar.jsx";
import HeroSection from "../components/HeroSection.jsx";
import KeyFeatures from "../components/KeyFeatures.jsx";
import DiscoverSection from "../components/DiscoverSection.jsx";
import Feedbacks from "../components/Feedbacks.jsx";
import Heading from "../components/Heading.jsx";
import Faq from "../components/Faq.jsx";
import Footer from "../components/Footer.jsx";
import { setClientId } from "../Slices/pagesSlice.js";
const Home = () => {
  const clientId =
    localStorage.getItem("token") ||
    useSelector((state) => state.pages.clientId);

  useEffect(() => {
    if (!clientId) {
      let payload = uuidv4();
      localStorage.setItem("token", payload);
      setClientId(payload);
    }
  }, [clientId]);

  // ✅ refs create kiye
  const keyFeatureRef = useRef(null);
  const faqRef = useRef(null);
  const footerRef = useRef(null);

  // ✅ scroll functions
  const scrollToKeyFeature = () =>
    keyFeatureRef.current?.scrollIntoView({ behavior: "smooth" });

  const scrollToFaq = () =>
    faqRef.current?.scrollIntoView({ behavior: "smooth" });

  const scrollToFooter = () =>
    footerRef.current?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="">
      {/* pass scroll funcs to Navbar */}
      <Navbar
        onKeyFeatureClick={scrollToKeyFeature}
        onFaqClick={scrollToFaq}
        onFooterClick={scrollToFooter}
      />

      <Heading /> 
      <HeroSection />

      {/* ✅ attach ref here */}
      <div ref={keyFeatureRef}>
        <KeyFeatures />
      </div>

      <DiscoverSection />

      <Feedbacks />
      <div ref={faqRef}>
        <Faq />
      </div>

      <div ref={footerRef}>
        <Footer />
      </div>
    </div>
  );
};

export default Home;
