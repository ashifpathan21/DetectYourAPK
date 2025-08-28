import React from 'react'
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Home from "./pages/Home.jsx";
import AppReportPage from "./pages/AppReportPage.jsx";
import Analyse from "./pages/Analyse.jsx";
import Reports from "./pages/Reports.jsx";


const App = () => {
  return (
    <div className=" overflow-x-hidden bg-gray-800 text-white">

      <div className='content'>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/analyse" element={<Analyse />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/report/:id" element={<AppReportPage />} />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App
