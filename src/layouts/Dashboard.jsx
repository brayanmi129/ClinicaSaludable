import LogotypeCentered from "../components/LogotypeCentered";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Divider from "../components/Divider";
import { useState } from "react";

const Dashboard = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-fit h-full hidden overflow-auto bg-gradient-to-b from-blue-500 to-blue-700 
                      shadow-xl/90 px-10 pt-15 lg:flex flex-col items-center text-white scrollbar-custom">
        <LogotypeCentered text="Clínica del Norte" isMobile={false} />
        <Divider />
        <Sidebar />
      </div>

      <div onClick={toggleMenu} className="z-100 cursor-pointer w-16 h-16 bg-gradient-to-b from-blue-500 to-blue-700 rounded-full fixed right-5 top-5 lg:hidden shadow-lg/40 transition-transform duration-200 hover:scale-105 active:scale-95 flex items-center justify-center">
        {isMenuOpen ? (
          <svg className="w-8 h-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-8 h-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        )}
      </div>

      <div className={`fixed inset-0 z-20 lg:hidden transition-all duration-300 ${isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}>
        <div className="absolute inset-0 bg-gray-900/50" onClick={toggleMenu}></div>

        <div className={`absolute top-0 left-0 h-full w-3/4 md:max-w-[33%] bg-gradient-to-b from-blue-500 to-blue-700 shadow-xl/90 px-10 pt-15 flex flex-col items-center text-white transition-transform duration-300 ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
          <LogotypeCentered text="Clínica del Norte" />
          <Divider />
          <Sidebar />
        </div>
      </div>

      <div className="w-full h-full">
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;