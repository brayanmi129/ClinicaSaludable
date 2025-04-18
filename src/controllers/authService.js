export const loginUser = async (email, password) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_AUTH_URL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
  
      if (!response.ok) {
        throw new Error('Credenciales incorrectas.');
      }
  
      return await response.json();
    } catch (error) {
      if (error.message === 'Failed to fetch') {
        throw new Error('No se pudo conectar con el servidor. Verifica tu conexión.');
      }
      throw error;
    }
  };

export const handleMicrosoftLogin = () => {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  
  if (isMobile) {
    window.location.href = import.meta.env.VITE_MS_AUTH_URL;
    return;
  }

  return new Promise((resolve, reject) => {
    const popup = window.open(
      import.meta.env.VITE_MS_AUTH_URL,
      "Inicia con Microsoft",
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
      if (event.origin !== import.meta.env.VITE_API_URL) return;

      if (event.data.type === "oauth-status") {
        window.removeEventListener("message", handleMessage);
      
        if (event.data.token && event.data.token !== "Failed") {
          sessionStorage.setItem('authToken', event.data.token);
          popup.close();
          resolve(true);
        } else {
          reject(new Error("Error al iniciar sesión"));
        }
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
      "Inicia con Google",
      "width=500,height=600"
    );

    const handleMessage = (event) => {
      //if (event.origin !== import.meta.env.VITE_API_URL) return;

      if (event.data.type === "oauth-status") {
        window.removeEventListener("message", handleMessage);

        if (event.data.token === "Success") {
          sessionStorage.setItem('authToken', event.data.token);
          fetch(import.meta.env.VITE_API_AUTH)
          popup.close();
          resolve(true);
        } else {
          reject(new Error("Error al iniciar sesión con Google."));
        }
      }
    };

    window.addEventListener("message", handleMessage);
  });
};