import { useState } from "react";
import Appointment from "./Appointment";
import Modal from "./Modal";
import Button from "./Button";
import FormInput from "./FormInput";
import Calendar from "./Calendar";
import { updateAppointment } from "../utils/appointments";

const Tabs = ({ tab1Name, tab2Name, citasTab1, citasTab2, horasOcupadas }) => {
  const [activeTab, setActiveTab] = useState("tab1");
  const [modalCita, setModalCita] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formValues, setFormValues] = useState({});
  const userToken = sessionStorage.getItem("authToken");
  const [mensaje, setMensaje] = useState(null);
  const [mostrarSoloMensaje, setMostrarSoloMensaje] = useState(false);

  const isModified = (original, modified) => {
    return Object.keys(modified).some((key) => original[key] !== modified[key]);
  };

  const abrirModal = (cita) => {
    setModalCita(cita);
    setFormValues(cita);
    setEditMode(false);
  };

  const cerrarModal = () => {
    setModalCita(null);
    setEditMode(false);
    setFormValues({});
  };

  const handleUpdateAppointment = async (updatedValues, reload = false) => {
    try {
      const updatedAppointment = await updateAppointment(
        modalCita.appointment_id,
        userToken,
        updatedValues
      );
      setModalCita(updatedAppointment);
      setFormValues(updatedAppointment);
      setEditMode(false);
      setMensaje({ tipo: "exito", texto: "Cita actualizada correctamente." });
      setMostrarSoloMensaje(true);

      setTimeout(() => {
        setMensaje(null);
        setMostrarSoloMensaje(false);
        cerrarModal();
        if (reload) {
          location.reload();
        }
      }, 2000);
    } catch (error) {
      console.error("Error al actualizar la cita:", error.message);
      setMensaje({
        tipo: "error",
        texto: "No se pudo actualizar la cita: " + error.message,
      });
      setMostrarSoloMensaje(true);

      setTimeout(() => {
        setMensaje(null);
        setMostrarSoloMensaje(false);
      }, 3000);
    }
  };

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
                onClick={() => abrirModal(cita)}
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
                onClick={() => abrirModal(cita)}
              />
            ))
          ) : (
            <p className="text-gray-500">No hay citas pasadas.</p>
          )}
        </div>
      )}

      <Modal isOpen={!!modalCita} onClose={cerrarModal}>
        {modalCita && (
          <>
            <div className="flex justify-between items-center mb-6 border-b border-gray-300 pb-2">
              <h2 className="text-lg font-semibold text-gray-900">
                {editMode ? "Modificar fecha y hora" : "Detalles de la cita"}
              </h2>
              <button
                onClick={cerrarModal}
                aria-label="Cerrar modal"
                className="cursor-pointer text-gray-500 hover:text-gray-900 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {mostrarSoloMensaje ? (
              <div
                className={`mb-4 px-4 py-3 rounded text-sm text-center transition-all duration-300 ${
                  mensaje?.tipo === "exito" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }`}
              >
                {mensaje?.texto}
              </div>
            ) : (
              <>
                {!editMode && (
                  <div className="text-gray-700 text-sm">
                    <FormInput
                      id="appointment_date"
                      label="Fecha"
                      value={formValues.appointment_date?.split("T")[0] || ""}
                      onChange={(e) =>
                        setFormValues({ ...formValues, appointment_date: e.target.value })
                      }
                      disabled={!editMode}
                    />
                    <FormInput
                      id="appointment_time"
                      label="Hora"
                      value={formValues.appointment_time?.split("T")[1]?.slice(0, 5) || ""}
                      onChange={(e) =>
                        setFormValues({ ...formValues, appointment_time: e.target.value })
                      }
                      disabled={!editMode}
                    />
                    <FormInput
                      id="doctor_name"
                      label="Doctor"
                      value={formValues.doctor_name || ""}
                      onChange={(e) =>
                        setFormValues({ ...formValues, doctor_name: e.target.value })
                      }
                      disabled={!editMode}
                    />
                    <FormInput
                      id="status"
                      label="Estado"
                      value={formValues.status || ""}
                      onChange={(e) => setFormValues({ ...formValues, status: e.target.value })}
                      disabled={!editMode}
                    />
                    <FormInput
                      id="location"
                      label="Consultorio"
                      value={formValues.location || ""}
                      onChange={(e) => setFormValues({ ...formValues, location: e.target.value })}
                      disabled={!editMode}
                    />
                  </div>
                )}

                {editMode && (
                  <div className="mt-6">
                    <Calendar
                      horasOcupadas={horasOcupadas}
                      fechaSeleccionada={
                        formValues.appointment_date ? new Date(formValues.appointment_date) : null
                      }
                      horaSeleccionada={formValues.appointment_time}
                      onFechaYHoraSeleccionadas={(fecha, hora) => {
                        setFormValues({
                          ...formValues,
                          appointment_date: fecha ? fecha.toISOString() : null,
                          appointment_time: hora,
                        });
                      }}
                    />
                  </div>
                )}

                <div className="mt-6 flex justify-around gap-3">
                  {editMode ? (
                    <>
                      <div className="w-40">
                        <Button
                          variant="secondary"
                          onClick={() => {
                            setFormValues(modalCita);
                            setEditMode(false);
                          }}
                        >
                          Cancelar edición
                        </Button>
                      </div>
                      <div className="w-40">
                        <Button
                          variant="primary"
                          onClick={() => {
                            if (isModified(modalCita, formValues)) {
                              handleUpdateAppointment(formValues, true);
                            } else {
                              cerrarModal();
                            }
                          }}
                        >
                          Guardar cambios
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      {modalCita.status === "SCHEDULED" && (
                        <>
                          <div className="w-40">
                            <Button
                              variant="danger"
                              onClick={() => handleUpdateAppointment({ status: "CANCELED" }, true)}
                            >
                              Cancelar cita
                            </Button>
                          </div>
                          <div className="w-40">
                            <Button
                              variant="primary"
                              onClick={() => {
                                setEditMode(true);
                                setFormValues(modalCita);
                              }}
                            >
                              Modificar cita
                            </Button>
                          </div>
                        </>
                      )}
                    </>
                  )}
                </div>
              </>
            )}
          </>
        )}
      </Modal>
    </div>
  );
};

export default Tabs;