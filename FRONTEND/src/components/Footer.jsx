import React from "react";
import {useNavigate} from 'react-router-dom'
import { Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  const navigate = useNavigate()
  return (
    <footer className=" py-8">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-8">
        {/* Left - Contact Info */}
        <div>
          <h3 className="text-xl font-bold mb-3">CONTACT US</h3>
          <p className="text-gray-300 mb-2">
            We’d love to hear from you! Whether you have questions, feedback, or
            need support, our team is here to help.
          </p>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <i className=" ri-mail-line  text-cyan-400" size={18} />
              secureapk@gmail.com
            </li>
            <li className="flex items-center gap-2">
              <i className="ri-phone-line text-cyan-400" size={18} />
              +91 9302150511
            </li>
            <li className="flex items-center gap-2">
              <i className="ri-map-pin-line text-cyan-400" size={18} />
              JEC, Jabalpur (M.P.)
            </li>
          </ul>
        </div>

        {/* Center - Quick Links */}
        <div>
          <h3 className="text-xl font-bold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-gray-300">
            <li onClick={() => navigate('/')} className="hover:text-cyan-400 cursor-pointer">Home</li>
            <li onClick={() => navigate('/analyse')} className="hover:text-cyan-400 cursor-pointer">Features</li>
            <li  className="hover:text-cyan-400 cursor-pointer">FAQ</li>
            <li className="hover:text-cyan-400 cursor-pointer">Contact</li>
          </ul>
        </div>

        {/* Right - Branding */}
        <div className="flex flex-col justify-between">
          <h3 className="text-xl font-bold mb-3 text-cyan-400">SecureAPK</h3>
          <p className="text-gray-400">
            Build with advanced security technology to keep your apps safe.
          </p>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="text-center text-gray-500 mt-6 border-t border-gray-700 pt-4">
        © {new Date().getFullYear()} SecureAPK. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
