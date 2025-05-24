export const getCitas = async (token) => {
  try {
    const response = await fetch(import.meta.env.VITE_GET_CITAS, {
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