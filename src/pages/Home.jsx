import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Menu,
  LogOut,
  Calendar,
  User,
  LayoutDashboard,
  ClipboardList,
  X,
} from "lucide-react";

const Home = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <aside
        className={`${
          sidebarOpen ? "translate-x-0 shadow-2xl shadow-black" : "-translate-x-full"
        } fixed z-40 top-0 left-0 h-full w-64 bg-blue-600 shadow-black shadow-2xl text-white p-4 transform transition-transform duration-300 lg:translate-x-0 lg:static lg:w-64`}
      >
        <div className="flex flex-col justify-between h-full">
          <div className="space-y-6">
            <h1 className="text-xl font-bold text-center">Clínica del Norte</h1>

            <nav className="mt-8 space-y-4">
              {[
                { label: "Dashboard", icon: <LayoutDashboard size={18} /> },
                { label: "Citas", icon: <Calendar size={18} /> },
                { label: "Pacientes", icon: <User size={18} /> },
                { label: "Reportes", icon: <ClipboardList size={18} /> },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 px-3 py-2 bg-blue-500/30 rounded-md animate-pulse"
                >
                  {item.icon}
                  <span className="h-4 bg-blue-500 rounded w-2/3"></span>
                </div>
              ))}
            </nav>
          </div>

          <button
            onClick={logout}
            className="cursor-pointer font-bold mt-6 flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-md text-sm transition"
          >
            <LogOut size={18} /> Cerrar sesión
          </button>
        </div>
      </aside>

      {!sidebarOpen && (
        <button
          className="fixed top-4 left-4 z-40 bg-blue-600 p-3 rounded-full shadow-lg lg:hidden"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu size={28} color="white"/>
        </button>
      )}

      {sidebarOpen && (
        <button
          className="fixed top-4 right-4 z-50 bg-blue-600 p-3 rounded-full shadow-lg lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <X size={28} color="white"/>
        </button>
      )}

      <main className="flex-1 p-8 overflow-auto w-full lg:ml-64">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-300 rounded w-1/2" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-40 bg-gray-300 rounded-xl shadow-md"
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;