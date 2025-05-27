const API_URL = import.meta.env.VITE_API_URL;

export const getLabs = async (token) => {
  try {
    const response = await fetch(import.meta.env.VITE_GET_LABS, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }
    });

    switch (response.status) {
      case 200:
        return await response.json();
      case 401:
        throw new Error("Credenciales incorrectas. Intente nuevamente.");
      default:
        throw new Error("Ocurrió un error al obtener los resultados de laboratorio.");
    }

  } catch (error) {
    if (error.message === "Failed to fetch") {
      throw new Error("No se pudo conectar con el servidor.");
    }
    throw error;
  }
};

export const getMyLabs = async () => {
  try {
    const token = sessionStorage.getItem("authToken");
    const response = await fetch(`${API_URL}/labs/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener tus resultados.");
    }

    return await response.json();
  } catch (error) {
    console.error(error);
  }
};

export const getAllLabs = async () => {
  try {
    const token = sessionStorage.getItem("authToken");
    const response = await fetch(`${API_URL}/labs/all`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener todos los resultados.");
    }

    return await response.json();
  } catch (error) {
    console.error(error);
  }
};

export const getLabsForUser = async (userId) => {
  try {
    const token = sessionStorage.getItem("authToken");
    const response = await fetch(`${API_URL}/labs/patient/${userId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener los resultados del usuario.");
    }

    return await response.json();
  } catch (error) {
    console.error(error);
  }
};