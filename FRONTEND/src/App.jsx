import React from 'react'
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Home from "./pages/Home.jsx";
import AppReportPage from "./pages/AppReportPage.jsx";
import Analyse from "./pages/Analyse.jsx";
const App = () => {
  return (
    <div className="bg-[#0A1B2B] overflow-x-hidden text-white">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/analyse" element={<Analyse />} />
          <Route path="/report/:id" element={<AppReportPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App
