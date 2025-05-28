import React, { useState, useEffect } from "react";
import { format, addDays, isSameDay, parseISO } from "date-fns";
import { es } from "date-fns/locale"; // Para fechas en español

// Función para obtener la información del usuario de sessionStorage
const useDoctorSession = () => {
  const [doctorId, setDoctorId] = useState(null);

  useEffect(() => {
    try {
      const userSessionString = sessionStorage.getItem("userData");
      if (userSessionString) {
        const userSession = JSON.parse(userSessionString);
        // Asegúrate de usar la propiedad correcta que contiene el ID del doctor.
        // Según tu ejemplo, 'doctor_id' es el que se usa en la API.
        // Si tu API usa 'user_id' para el doctor, cámbialo a userSession.user_id
        setDoctorId(userSession.user_id);
      }
    } catch (e) {
      console.error("Error al leer la sesión de sessionStorage:", e);
      setDoctorId(null); // En caso de error, el ID es nulo
    }
  }, []); // Se ejecuta solo una vez al montar el componente

  return doctorId;
};

const AppointmentsList = () => {
  const doctorId = useDoctorSession(); // Obtén el ID del doctor de sessionStorage
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [selectedDay, setSelectedDay] = useState(0); // 0: Hoy, 1: Mañana, 2: Pasado mañana
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Función para obtener las citas de la API
  useEffect(() => {
    const fetchAppointments = async () => {
      // Solo intenta cargar si tenemos un doctorId
      if (!doctorId) {
        setLoading(false); // No hay doctorId, no hay carga
        setError("ID del doctor no encontrado en la sesión. Asegúrate de iniciar sesión.");
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `https://clinica-api-managment.azure-api.net/medicalAppointments/doctor/${doctorId}`,
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("authToken")}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const rawAppointments = data[0] || []; // La API devuelve un array anidado

        const parsedAppointments = rawAppointments.map((appointment) => {
          // Combina la fecha y la hora para crear un objeto Date completo
          const appointmentDate = parseISO(appointment.appointment_date);
          const appointmentTime = parseISO(appointment.appointment_time);

          // Establece la hora del appointmentDate usando los valores de appointmentTime
          appointmentDate.setHours(appointmentTime.getHours());
          appointmentDate.setMinutes(appointmentTime.getMinutes());
          appointmentDate.setSeconds(appointmentTime.getSeconds());
          appointmentDate.setMilliseconds(appointmentTime.getMilliseconds());

          return {
            ...appointment,
            full_appointment_datetime: appointmentDate, // Guarda la fecha y hora combinadas
            display_time: format(appointmentTime, "hh:mm a", { locale: es }), // Formato para mostrar la hora
          };
        });
        setAppointments(parsedAppointments);
      } catch (e) {
        console.error("Error al obtener las citas:", e);
        setError("No se pudieron cargar las citas. Inténtalo de nuevo más tarde.");
      } finally {
        setLoading(false);
      }
    };

    // Llama a fetchAppointments solo si doctorId no es nulo
    if (doctorId !== null) {
      fetchAppointments();
    }
  }, [doctorId]); // Se ejecuta cuando el doctorId cambia (incluido cuando se carga de sessionStorage)

  // Efecto para filtrar las citas cada vez que cambian las citas o el día seleccionado
  useEffect(() => {
    const today = new Date();
    // Ajustamos today a la fecha actual sin la hora para una comparación precisa del día
    today.setHours(0, 0, 0, 0);

    const targetDay = addDays(today, selectedDay);
    // Ajustamos targetDay a la fecha sin la hora
    targetDay.setHours(0, 0, 0, 0);

    const appointmentsForSelectedDay = appointments
      .filter((appointment) => isSameDay(appointment.full_appointment_datetime, targetDay))
      .sort((a, b) => a.full_appointment_datetime - b.full_appointment_datetime); // Ordenar por hora

    setFilteredAppointments(appointmentsForSelectedDay);
  }, [appointments, selectedDay]);

  const getDayLabel = (offset) => {
    // La fecha actual es 2025-05-28
    const today = new Date(); // Esto obtendrá la fecha y hora actual del usuario

    // Obtener la fecha para el offset dado
    const targetDate = addDays(today, offset);

    if (isSameDay(targetDate, today)) return "Hoy";
    if (isSameDay(targetDate, addDays(today, 1))) return "Mañana";
    if (isSameDay(targetDate, addDays(today, 2))) return "Pasado Mañana";
    return format(targetDate, "EEEE", { locale: es }); // Para otros días (por si extiendes el rango)
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-lg text-blue-600">Cargando citas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">
        <p className="text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-md">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">Agenda de Citas</h3>

      {/* Filtro de días */}
      <div className="flex justify-center gap-3 mb-6 flex-wrap">
        {[0, 1, 2].map((offset) => (
          <button
            key={offset}
            onClick={() => setSelectedDay(offset)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition ${
              selectedDay === offset
                ? "bg-blue-500 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {getDayLabel(offset)} ({format(addDays(new Date(), offset), "dd/MM", { locale: es })})
          </button>
        ))}
      </div>

      {/* Lista de citas */}
      {filteredAppointments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAppointments.map((appointment) => (
            <div
              key={appointment.appointment_id}
              className="bg-blue-50 p-4 rounded-lg shadow-sm border border-blue-200"
            >
              <p className="text-lg font-bold text-blue-800 mb-1">{appointment.display_time}</p>
              <p className="text-gray-700">
                Paciente: <span className="font-medium">{appointment.patient_name}</span>
              </p>
              <p className="text-gray-600 text-sm">Tipo de Cita: {appointment.appointment_type}</p>
              <p className="text-gray-600 text-sm">Ubicación: {appointment.location}</p>
              <p className="text-gray-600 text-sm">
                Estado:{" "}
                <span
                  className={`font-semibold ${
                    appointment.status === "SCHEDULED"
                      ? "text-green-600"
                      : appointment.status === "COMPLETED"
                      ? "text-blue-600"
                      : appointment.status === "CANCELED"
                      ? "text-red-600"
                      : "text-yellow-600" // MISSING u otro estado
                  }`}
                >
                  {appointment.status}
                </span>
              </p>
              <p className="text-gray-500 text-xs mt-2">
                Fecha: {format(appointment.full_appointment_datetime, "PPP", { locale: es })}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-600 py-8">
          <p className="text-lg">No hay citas programadas para este día.</p>
        </div>
      )}
    </div>
  );
};

export default AppointmentsList;
