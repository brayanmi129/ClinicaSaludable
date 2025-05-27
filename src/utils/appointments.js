export const getAllAppointments = async (token) => {
  try {
    const response = await fetch(import.meta.env.VITE_GET_ALL_APPOINTMENTS, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }
    });

    switch (response.status) {
      case 200:
        const data = await response.json();
        return data;
      case 401:
        throw new Error("Credenciales incorrectas. Intente nuevamente.");

      default:
        throw new Error("Ocurrió un error al obtener las citas.");
    }

  } catch (error) {
    if (error.message === "Failed to fetch") {
      throw new Error("No se pudo conectar con el servidor.");
    }
    throw error;
  }
};

export const updateAppointment = async (appointmentId, token, data) => {
  console.log(data);
  try {
    const response = await fetch(`${import.meta.env.VITE_UPDATE_APPOINTMENT}/${appointmentId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    switch (response.status) {
      case 200:
        return await response.json();
      case 401:
        throw new Error("Credenciales incorrectas. Intente nuevamente.");
      case 404:
        throw new Error("Cita no encontrada.");
      default:
        throw new Error("Ocurrió un error al actualizar la cita.");
    }

  } catch (error) {
    if (error.message === "Failed to fetch") {
      throw new Error("No se pudo conectar con el servidor.");
    }
    throw error;
  }
};

export const createAppointment = async (token, data) => {
  try {
    const response = await fetch(import.meta.env.VITE_CREATE_APPOINTMENT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (response.ok) {
      return responseData;
    }

    const mensaje = responseData?.message || "Ocurrió un error al crear la cita.";
    throw new Error(mensaje);

  } catch (error) {
    if (error.message === "Failed to fetch") {
      throw new Error("No se pudo conectar con el servidor.");
    }

    console.error("Error técnico en createAppointment:", error);
    throw error;
  }
};