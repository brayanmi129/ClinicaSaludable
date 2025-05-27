export const getMedicalHistory = async (token, userId) => {
  try {
    const baseUrl = import.meta.env.VITE_GET_MEDICAL_RECORDS;
    const url = `${baseUrl}/${userId}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    switch (response.status) {
      case 200:
        return result;
      case 401:
        console.error("Error 401: No autorizado", result);
        throw new Error("Credenciales incorrectas. Intente nuevamente.");
      case 404:
        console.warn("Error 404: Historia médica no encontrada", result);
        throw new Error("Historia médica no encontrada.");
      default:
        console.error(`Error ${response.status}:`, result);
        throw new Error("Ocurrió un error al obtener la historia médica.");
    }
  } catch (error) {
    if (error.message === "Failed to fetch") {
      console.error("No se pudo conectar con el servidor.");
      throw new Error("No se pudo conectar con el servidor.");
    }

    console.error("Error inesperado:", error);
    throw error;
  }
};