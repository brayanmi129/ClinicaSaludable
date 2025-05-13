import Logo from '../assets/medic.png';
import GoogleLogo from '../assets/logo-google.png';
import MSLogo from '../assets/logo-ms.png';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { loginWithEmailPassword, redirectToGoogleAuth, completeOAuthLogin } from '../utils/auth';
import FormInput from '../components/FormInput';
import PrimaryButton from '../components/Button';
import Logotype from '../components/Logotype';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        completeOAuthLogin(navigate, setIsLoading, setErrorMessage);
    }, []);

    const handleLogin = async () => {
        if (!email || !password) {
            setErrorMessage("Por favor, completa todos los campos.");
            return;
        }
      
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setErrorMessage("Correo no válido.");
            return;
        }
      
        setIsLoading(true);
        setErrorMessage("");
      
        try {
            const user = await loginWithEmailPassword(email, password);
            navigate("/home");
        } catch (error) {
            setErrorMessage(error.message || "Error al iniciar sesión.");
        } finally {
            setIsLoading(false);
        }
    };      

    return (
        <div className="h-full w-full flex items-center justify-center">
            <div className="bg-gradient-to-b from-blue-500 to-blue-700 h-full w-3/7 p-20 hidden flex-col box-border lg:display-block lg:flex lg:items-center lg:justify-center lg:w-3/7 lg:h-screen">
                <Logotype text="Clínica del Norte" />
                <div className='h-full flex flex-col justify-around'>
                    <div className="w-full h-7/15 flex items-center justify-center">
                        <img src={Logo} alt=""/>
                    </div>
                    <div className='w-full h-fit flex items-start flex-col text-sky-50' style={{ fontFamily: 'Inter, sans-serif' }}>
                        <div className='mb-5 text-[2em]'>
                            <h1>¡Bienvenido!</h1>
                        </div>
                        <div className='text-[1.2em]'>
                            <p>En la <b>Clínica del Norte</b> nos especializamos en darte la mejor atención en cualquier etapa de tu vida. Contamos con tecnología de última generación, espacios cómodos y un trato humano que te hace sentir como en casa.</p>  
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-full h-screen shadow-xl/90 p-10 lg:p-20 flex flex-col justify-start items-center lg:w-3/4 lg:items-start overflow-auto">
                <div className='w-full h-full lg:w-3/4 flex flex-col gap-5'>
                    <Logotype text="Clínica del Norte" isMobile={true}/>
                    <div className='mt-auto mb-auto w-full lg:w-5/6'>
                        <div className='w-full h-fit text-[2.2em] font-bold text-blue-600'>
                            <h3>Inicia sesión</h3>
                        </div>
                        <div className='w-full text-[1.2em] mb-5 text-gray-700'>
                            <p>Ingresa a tu cuenta para programar citas, descargar resultados y más.</p>
                        </div>
                        <div>
                            <FormInput id='email' label='Correo electrónico' value={email} onChange={(e) => setEmail(e.target.value)}/>
                            <FormInput id='password' label='Contraseña' type='password' value={password} onChange={(e) => setPassword(e.target.value)}/>
                            <div className='text-red-500 text-[1em] font-semibold'>
                                <p>{errorMessage}</p>
                            </div>
                            <PrimaryButton onClick={handleLogin} isLoading={isLoading} variant="primary">
                                Iniciar sesión
                            </PrimaryButton>
                        </div>
                        <div className="flex items-center gap-4 my-6">
                            <hr className="flex-grow border-t border-gray-300" />
                            <span className="text-gray-500 text-sm">Ó</span>
                            <hr className="flex-grow border-t border-gray-300" />
                        </div>
                        <div className='flex flex-col w-full justify-around text-[1.2em]'>
                            <div className='w-full h-[70px] mb-5'>
                                <button className="cursor-pointer flex items-center justify-center w-full h-full border border-gray-300 rounded-md py-2 px-4 gap-2 hover:bg-gray-100 transition" onClick={redirectToGoogleAuth}>
                                    <img src={GoogleLogo} alt="Google" className="w-10 h-10" />
                                    <span className="text-gray-700">Ingresa con Google</span>
                                </button>
                            </div>
                            <div className='w-full h-[70px]'>
                                <button className="cursor-pointer h-full flex items-center justify-center w-full border border-gray-300 rounded-md py-2 px-4 gap-2 hover:bg-gray-100 transition">
                                    <img src={MSLogo} alt="Google" className="w-10 h-10" />
                                    <span className="text-gray-700">Ingresa con Microsoft</span>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className='flex items-center gap-4 my-6 lg:w-5/6 pb-20'>
                        <span className="text-blue-600 text-l underline"><a href="">¿Olvidaste tu contraseña?</a></span>
                        <hr className="flex-grow border-t border-gray-300" />
                        <span className="text-blue-600 text-l underline"><a href="">¿Ayuda?</a></span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;