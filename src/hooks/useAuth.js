import { loginUser, handleMicrosoftLogin, handleGoogleLogin } from '../controllers/authService';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const login = async (email, password) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !password) {
      setErrorMessage('Por favor, completa todos los campos.');
      return;
    }

    if (!emailRegex.test(email)) {
      setErrorMessage('Correo no válido. Revisa e intenta de nuevo.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const data = await loginUser(email, password);
      console.log('Usuario autenticado:', data);
      navigate('/home');
    } catch (err) {
      setErrorMessage(err.message || 'Error al iniciar sesión.');
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithMicrosoft = async () => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const result = await handleMicrosoftLogin();
      if (result) {
        navigate('/home');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Error al iniciar sesión con Microsoft.');
    } finally {
      setIsLoading(false);
    }
  };

const loginWithGoogle = async () => {
  setIsLoading(true);
  setErrorMessage('');

  try {
    const result = await handleGoogleLogin();
    console.log(result);
    if (result) {
      navigate('/home');
    }
  } catch (err) {
    setErrorMessage(err.message || 'Error al iniciar sesión con Google.');
  } finally {
    setIsLoading(false);
  }
};
  return { login, loginWithMicrosoft, loginWithGoogle, isLoading, errorMessage };
};