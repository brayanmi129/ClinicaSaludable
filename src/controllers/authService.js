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
        throw new Error('Credenciales incorrectas');
      }
  
      return await response.json();
    } catch (error) {
      if (error.message === 'Failed to fetch') {
        throw new Error('No se pudo conectar con el servidor. Verifica tu conexión.');
      }
      throw error;
    }
  };