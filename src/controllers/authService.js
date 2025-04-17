export const loginUser = async (email, password) => {
    try {
      const response = await fetch('https://api.tuapp.com/login', {
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
      // Interceptamos errores como "Failed to fetch" para personalizar el mensaje
      if (error.message === 'Failed to fetch') {
        throw new Error('No se pudo conectar con el servidor. Verifica tu conexión.');
      }
      throw error; // Mantenemos el error original si no es el esperado
    }
  };