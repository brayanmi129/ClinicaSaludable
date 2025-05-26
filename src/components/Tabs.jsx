import { useState } from "react";
import Appointment from "./Appointment";

const Tabs = ({ tab1Name, tab2Name, citasTab1, citasTab2 }) => {
  const [activeTab, setActiveTab] = useState("tab1");

  return (
    <div className="w-full h-full">
      {/* Botones de pestañas */}
      <div className="flex border-b border-gray-300 mb-4">
        <button
          className={`px-4 py-2 text-sm font-medium cursor-pointer ${
            activeTab === "tab1"
              ? "border-b-2 border-blue-500 text-blue-500"
              : "text-gray-500 hover:text-blue-500"
          }`}
          onClick={() => setActiveTab("tab1")}
        >
          {tab1Name || "Pestaña 1"}
        </button>
        <button
          className={`cursor-pointer ml-4 px-4 py-2 text-sm font-medium ${
            activeTab === "tab2"
              ? "border-b-2 border-blue-500 text-blue-500"
              : "text-gray-500 hover:text-blue-500"
          }`}
          onClick={() => setActiveTab("tab2")}
        >
          {tab2Name || "Pestaña 2"}
        </button>
      </div>

      {/* Contenido de pestañas */}
      {activeTab === "tab1" && (
        <div className="flex flex-col gap-3 max-h-[200px] overflow-y-auto">
          {citasTab1?.length > 0 ? (
            citasTab1.map((cita) => (
              <Appointment
                key={cita.appointment_id}
                date={cita.appointment_date.split("T")[0]}
                time={cita.appointment_time.split("T")[1].slice(0, 5)}
                doctor={cita.doctor_name}
                service={cita.appointment_type}
                location={cita.location}
                status={cita.status}
              />
            ))
          ) : (
            <p className="text-gray-500">No hay citas próximas.</p>
          )}
        </div>
      )}

      {activeTab === "tab2" && (
        <div className="flex flex-col gap-3 max-h-[200px] overflow-y-auto">
          {citasTab2?.length > 0 ? (
            citasTab2.map((cita) => (
              <Appointment
                key={cita.appointment_id}
                date={cita.appointment_date.split("T")[0]}
                time={cita.appointment_time.split("T")[1].slice(0, 5)}
                doctor={cita.doctor_name}
                service={cita.appointment_type}
                location={cita.location}
                status={cita.status}
              />
            ))
          ) : (
            <p className="text-gray-500">No hay citas pasadas.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Tabs;