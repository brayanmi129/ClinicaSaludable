export const loginWithEmailPassword = async (email, password) => {
  try {
    const response = await fetch(import.meta.env.VITE_AUTH_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    switch (response.status) {
      case 200:
        const { token } = await response.json();
        if (!token) {
          throw new Error("No se recibió un token de autenticación.");
        }
        sessionStorage.setItem("authToken", token);
        getUserDataFromToken(token).then((userData) => {
          sessionStorage.setItem("userData", JSON.stringify(userData.user));
        });
        return token;
      case 401:
        throw new Error("Credenciales incorrectas. Intente nuevamente.");
      case 500:
        throw new Error("Hubo un problema al conectarse con el servidor.");
      default:
        throw new Error("Ocurrió un error.");
    }
  } catch (error) {
    if (error.message === "Failed to fetch") {
      throw new Error("No se pudo conectar con el servidor.");
    }
    throw error;
  }
};
  
export const logoutUser = () => {
  sessionStorage.removeItem("authToken");
  sessionStorage.removeItem("userData");
  window.location.reload();
};

export const getUserDataFromToken = async (token) => {
  try {
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

export const redirectToGoogleAuth = () => {
  window.location.href = import.meta.env.VITE_GOOGLE_AUTH_URL;
}

export const completeOAuthLogin = async (navigate, setLoading, setError) => {
  const queryParams = new URLSearchParams(window.location.search);
  const token = queryParams.get("token");

  if (token){
    try{
      setLoading(true);
      sessionStorage.setItem("authToken", token);
      window.history.replaceState({}, document.title, window.location.pathname);
      getUserDataFromToken(token).then((userData) => {
        sessionStorage.setItem("userData", JSON.stringify(userData));
      });
      navigate("/home");
    } catch (error) {
      setError(error.message || "Hubo un problema al validar tu sesión.");
    } finally {
      setLoading(false);
    }
  }
};