import React, { useState } from "react";
import { CalendarDays, FlaskConical } from "lucide-react"; // Asumiendo que usas lucide-react para los iconos
import HomeDoctor from "./HomeDoctor"; // Asegúrate de crear este archivo
import AppointmentsList from "./AppointmentsList"; // Asegúrate de crear este archivo

const AppointmentAndLabSwitch = () => {
  const [activeTab, setActiveTab] = useState("appointments"); // 'appointments' o 'labs'

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      {/* Contenedor de Botones */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <button
          onClick={() => setActiveTab("appointments")}
          className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-lg font-semibold transition ${
            activeTab === "appointments"
              ? "bg-blue-600 text-white shadow-lg"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          <CalendarDays size={22} /> Mis Citas
        </button>
        <button
          onClick={() => setActiveTab("labs")}
          className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-lg font-semibold transition ${
            activeTab === "labs"
              ? "bg-blue-600 text-white shadow-lg"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          <FlaskConical size={22} /> Laboratorios
        </button>
      </div>

      {/* Contenido Dinámico */}
      <div>
        {activeTab === "appointments" && <AppointmentsList />}
        {activeTab === "labs" && <HomeDoctor />}
      </div>
    </div>
  );
};

export default AppointmentAndLabSwitch;
