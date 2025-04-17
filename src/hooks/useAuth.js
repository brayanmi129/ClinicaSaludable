import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../controllers/authService';

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

  return { login, isLoading, errorMessage };
};