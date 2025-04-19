export const loginUser = async (email, password) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_AUTH_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error("Credenciales incorrectas.");
    }

    return await response.json();
  } catch (error) {
    if (error.message === "Failed to fetch") {
      throw new Error("No se pudo conectar con el servidor. Verifica tu conexión.");
    }
    throw error;
  }
};

export const handleMicrosoftLogin = () => {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  if (isMobile) {
    window.location.href = import.meta.env.VITE_GOOGLE_AUTH_URL;
    return;
  }

  return new Promise((resolve, reject) => {
    const popup = window.open(
      import.meta.env.VITE_MS_AUTH_URL,
      "Ingresa con Microsoft",
      "width=500,height=600"
    );

    if (!popup) {
      reject(new Error("No se pudo abrir la ventana de inicio de sesión."));
      return;
    }

    const checkPopupClosed = setInterval(() => {
      if (popup.closed) {
        clearInterval(checkPopupClosed);
        window.removeEventListener("message", handleMessage);
        reject(new Error("La ventana de inicio de sesión se cerró."));
      }
    }, 500);

    const handleMessage = (event) => {
      const { token, status } = event.data;
      if (token && status === "Success") {
        sessionStorage.setItem("authToken", token);

        clearInterval(checkPopupClosed);
        window.removeEventListener("message", handleMessage);
        popup.close();

        fetch(`${import.meta.env.VITE_AUTH_ME}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then((res) => res.json())
          .then((data) => {
            resolve(true);
          })
          .catch((err) => {
            reject(err);
          });
      }else if (status === "Fail") {
        clearInterval(checkPopupClosed);
        window.removeEventListener("message", handleMessage);
        popup.close();
        reject(new Error("No se pudo iniciar sesión con Microsoft."));
      }
    };

    window.addEventListener("message", handleMessage);
  });
};

export const handleGoogleLogin = () => {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  if (isMobile) {
    window.location.href = import.meta.env.VITE_GOOGLE_AUTH_URL;
    return;
  }

  return new Promise((resolve, reject) => {
    const popup = window.open(
      import.meta.env.VITE_GOOGLE_AUTH_URL,
      "Ingresa con Google",
      "width=500,height=600"
    );

    if (!popup) {
      reject(new Error("No se pudo abrir la ventana de inicio de sesión."));
      return;
    }

    const checkPopupClosed = setInterval(() => {
      if (popup.closed) {
        clearInterval(checkPopupClosed);
        window.removeEventListener("message", handleMessage);
        reject(new Error("La ventana de inicio de sesión se cerró."));
      }
    }, 500);

    const handleMessage = (event) => {
      const { token, status } = event.data;
      if (token && status === "Success") {
        sessionStorage.setItem("authToken", token);

        clearInterval(checkPopupClosed);
        window.removeEventListener("message", handleMessage);
        popup.close();

        fetch(`${import.meta.env.VITE_AUTH_ME}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then((res) => res.json())
          .then((data) => {
            resolve(true);
          })
          .catch((err) => {
            reject(err);
          });
      }else if (status === "Fail") {
        clearInterval(checkPopupClosed);
        window.removeEventListener("message", handleMessage);
        popup.close();
        reject(new Error("No se pudo iniciar sesión con Google."));
      }
    };

    window.addEventListener("message", handleMessage);
  });
};