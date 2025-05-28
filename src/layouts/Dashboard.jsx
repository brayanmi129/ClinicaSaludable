import LogotypeCentered from "../components/LogotypeCentered";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Divider from "../components/Divider";
import { useState, useEffect, useRef } from "react";
import { logoutUser } from "../utils/auth";

const Dashboard = () => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userData = JSON.parse(sessionStorage.getItem("userData"));
  const menuRef = useRef();

  const toggleMenu = () => {
    setIsSidebarVisible((prev) => !prev);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen((prev) => !prev);
  };

  const handleLogout = () => {
    logoutUser();
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Patient Dashboard Desktop */}
      <div
        className="w-fit h-full hidden overflow-auto bg-gradient-to-b from-blue-500 to-blue-700 
                      shadow-xl/90 px-10 pt-15 lg:flex flex-col items-center text-white scrollbar-custom"
      >
        <LogotypeCentered text="Clínica del Norte" isMobile={false} />
        <Divider />
        <Sidebar />
      </div>

      {/* Patient Dashboard Mobile */}
      <div
        onClick={toggleMenu}
        className="z-100 cursor-pointer w-16 h-16 bg-gradient-to-b from-blue-500 to-blue-700 rounded-full fixed bottom-10 right-10 lg:hidden shadow-lg/40 transition-transform duration-200 hover:scale-105 active:scale-95 flex items-center justify-center"
      >
        {isSidebarVisible ? (
          <svg
            className="w-8 h-8 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg
            className="w-8 h-8 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
        )}
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-0 z-20 lg:hidden transition-all duration-300 ${
          isSidebarVisible ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <div className="absolute inset-0 bg-gray-900/50" onClick={toggleMenu}></div>

        <div
          className={`absolute top-0 left-0 h-full w-3/4 md:max-w-[33%] bg-gradient-to-b from-blue-500 to-blue-700 shadow-xl/90 px-10 pt-15 flex flex-col items-center text-white transition-transform duration-300 ${
            isSidebarVisible ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <LogotypeCentered text="Clínica del Norte" />
          <Divider />
          <Sidebar />
        </div>
      </div>

      {/* Outlet */}
      <div className="w-full h-full py-2 px-3 lg:py-8 lg:px-10 overflow-auto">
        <div className="w-full h-20 border-b-2 border-gray-200 flex items-center text-3xl font-bold text-blue-600 justify-between">
          <div>
            <h1>¡Hola, {userData.first_name}!</h1>
          </div>

          <div className="flex items-center gap-6">
            <div className="cursor-pointer transition-transform duration-200 hover:scale-105">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-7"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
                />
              </svg>
            </div>

            {/* User Profile Button & Menu */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={toggleUserMenu}
                className="cursor-pointer w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-normal transition-transform duration-200 hover:scale-105"
                aria-label={`Open profile of ${userData.first_name}`}
              >
                {userData.first_name?.charAt(0).toUpperCase()}
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg overflow-hidden z-50 text-sm">
                  <button
                    onClick={handleLogout}
                    className="cursor-pointer flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
                  >
                    <svg
                      className="w-5 h-5 mr-2 text-blue-600"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1"
                      />
                    </svg>
                    Salir
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
