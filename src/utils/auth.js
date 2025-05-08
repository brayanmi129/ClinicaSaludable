export const loginWithEmailPassword = async (email, password) => {
    try {
      const response = await fetch(import.meta.env.VITE_AUTH_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
  
      if (!response.ok) {
        throw new Error("Credenciales incorrectas.");
      }
  
      const { token } = await response.json();
  
      if (!token) {
        throw new Error("No se recibió un token de autenticación.");
      }
  
      sessionStorage.setItem("authToken", token);
  
      const userResponse = await fetch(import.meta.env.VITE_AUTH_ME, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!userResponse.ok) {
        throw new Error("Error al obtener los datos del usuario.");
      }
  
      const userData = await userResponse.json();
      return userData;
  
    } catch (error) {
      if (error.message === "Failed to fetch") {
        throw new Error("No se pudo conectar con el servidor.");
      }
      throw error;
    }
  };
  
  export const logoutUser = () => {
    sessionStorage.removeItem("authToken");
  };