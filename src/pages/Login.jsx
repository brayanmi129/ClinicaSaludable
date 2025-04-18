import Logo from '../assets/medic.png';
import GoogleLogo from '../assets/logo-google.png';
import MSLogo from '../assets/logo-ms.png';
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

const Spinner = () => (
  <svg className="animate-spin h-5 w-5 text-white mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
  </svg>
);

const Login = () => {
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const { login, isLoading, errorMessage } = useAuth();

return (
    <div className="h-screen w-full flex items-center justify-center">
        <div className="bg-blue-600 h-full w-3/7 p-20 hidden flex-col box-border lg:block">
            <div className="w-full h-1/15 flex items-center">
                <div className="min-h-full max-h-full pr-5 flex items-center justify-center w-6 sm:w-8 md:w-20 aspect-square overflow-hidden">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="white"
                        className="w-full h-full"
                    >
                    <path fillRule="evenodd" d="M3 2.25a.75.75 0 0 0 0 1.5v16.5h-.75a.75.75 0 0 0 0 1.5H15v-18a.75.75 0 0 0 0-1.5H3ZM6.75 19.5v-2.25a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-.75.75h-3a.75.75 0 0 1-.75-.75ZM6 6.75A.75.75 0 0 1 6.75 6h.75a.75.75 0 0 1 0 1.5h-.75A.75.75 0 0 1 6 6.75ZM6.75 9a.75.75 0 0 0 0 1.5h.75a.75.75 0 0 0 0-1.5h-.75ZM6 12.75a.75.75 0 0 1 .75-.75h.75a.75.75 0 0 1 0 1.5h-.75a.75.75 0 0 1-.75-.75ZM10.5 6a.75.75 0 0 0 0 1.5h.75a.75.75 0 0 0 0-1.5h-.75Zm-.75 3.75A.75.75 0 0 1 10.5 9h.75a.75.75 0 0 1 0 1.5h-.75a.75.75 0 0 1-.75-.75ZM10.5 12a.75.75 0 0 0 0 1.5h.75a.75.75 0 0 0 0-1.5h-.75ZM16.5 6.75v15h5.25a.75.75 0 0 0 0-1.5H21v-12a.75.75 0 0 0 0-1.5h-4.5Zm1.5 4.5a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75h-.008a.75.75 0 0 1-.75-.75v-.008Zm.75 2.25a.75.75 0 0 0-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 0 0 .75-.75v-.008a.75.75 0 0 0-.75-.75h-.008ZM18 17.25a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75h-.008a.75.75 0 0 1-.75-.75v-.008Z" clipRule="evenodd" />
                    </svg>
                </div>
                <div
                    className="whitespace-nowrap w-full text-[1.5em] sm:text-xl md:text-2xl font-bold h-full flex items-center text-sky-50 px-5 border-l-2 border-sky-50"
                    style={{ fontFamily: 'Nunito, sans-serif' }}
                >
                    <h3>Clínica del Norte</h3>
                </div>
            </div>
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
        <div className="w-full h-full shadow-xl/90 p-10 lg:p-20 flex flex-col justify-center items-center lg:w-3/4 lg:items-start overflow-auto">
            <div className='w-full h-full lg:w-3/4 flex flex-col gap-5'>
                <div className="w-full h-1/15 flex items-center justify-start lg:hidden mb-10">
                    <div className="min-h-full max-h-full flex items-center justify-center w-20 pr-5 aspect-square overflow-hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-full h-full fill-blue-600 max-h-full">
                            <path fillRule="evenodd" d="M3 2.25a.75.75 0 0 0 0 1.5v16.5h-.75a.75.75 0 0 0 0 1.5H15v-18a.75.75 0 0 0 0-1.5H3ZM6.75 19.5v-2.25a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-.75.75h-3a.75.75 0 0 1-.75-.75ZM6 6.75A.75.75 0 0 1 6.75 6h.75a.75.75 0 0 1 0 1.5h-.75A.75.75 0 0 1 6 6.75ZM6.75 9a.75.75 0 0 0 0 1.5h.75a.75.75 0 0 0 0-1.5h-.75ZM6 12.75a.75.75 0 0 1 .75-.75h.75a.75.75 0 0 1 0 1.5h-.75a.75.75 0 0 1-.75-.75ZM10.5 6a.75.75 0 0 0 0 1.5h.75a.75.75 0 0 0 0-1.5h-.75Zm-.75 3.75A.75.75 0 0 1 10.5 9h.75a.75.75 0 0 1 0 1.5h-.75a.75.75 0 0 1-.75-.75ZM10.5 12a.75.75 0 0 0 0 1.5h.75a.75.75 0 0 0 0-1.5h-.75ZM16.5 6.75v15h5.25a.75.75 0 0 0 0-1.5H21v-12a.75.75 0 0 0 0-1.5h-4.5Zm1.5 4.5a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75h-.008a.75.75 0 0 1-.75-.75v-.008Zm.75 2.25a.75.75 0 0 0-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 0 0 .75-.75v-.008a.75.75 0 0 0-.75-.75h-.008ZM18 17.25a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75h-.008a.75.75 0 0 1-.75-.75v-.008Z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="whitespace-nowrap px-5 h-full flex items-center border-l-2 border-blue-600 w-2/3 text-[1.5em] font-bold text-blue-600" style={{ fontFamily: 'Nunito, sans-serif' }}>
                        <h3>Clínica del Norte</h3>
                    </div>
                </div>
                <div className='mt-auto mb-auto w-full lg:w-5/6'>
                    <div className='w-full h-fit text-[2.2em] font-bold text-blue-600'>
                        <h3>Inicia sesión</h3>
                    </div>
                    <div className='w-full text-[1.2em] mb-5 text-gray-700'>
                        <p>Ingresa a tu cuenta para programar citas, descargar resultados y más.</p>
                    </div>
                    <div>
                        <div className="relative w-full mb-5">
                            <input
                                name="email"
                                type="text"
                                id="email"
                                placeholder=" "
                                className="peer w-full border border-gray-300 rounded-md px-3 pt-5 pb-2.5 text-[1.2em] bg-white
                                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <label htmlFor="email" className="absolute left-3 px-1 text-gray-500 text-sm bg-white z-10 transition-all
                            peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2
                            peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400
                            peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-sm peer-focus:text-blue-500 peer-focus:bg-blue-50">
                            Correo electrónico
                            </label>
                        </div>
                        <div className="relative w-full mb-5">
                            <input
                            name="password"
                            type="password"
                            id="password"
                            placeholder=""
                            className="peer w-full border border-gray-300 rounded-md px-3 pt-5 pb-2.5 text-[1.2em] bg-white
                                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            onChange={(e) => setPassword(e.target.value)}
                            />
                            <label htmlFor="password" className="absolute left-3 px-1 text-gray-500 text-sm bg-white z-10 transition-all
                            peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2
                            peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400
                            peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-sm peer-focus:text-blue-500 peer-focus:bg-blue-50">
                            Contraseña
                            </label>
                        </div>
                        <div className='text-red-500 text-[1em] font-semibold'>
                            <p>{errorMessage}</p>
                        </div>
                        <button
                            type="submit"
                            className="cursor-pointer w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white text-[1.1em] font-semibold py-3 rounded-md shadow-md transition duration-300 ease-in-out
                            focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1 disabled:opacity-60 flex items-center justify-center"
                            onClick={() => login(email, password)}
                            disabled={isLoading}
                        >
                        {isLoading ? (<><Spinner /> Cargando...</>) : 'Iniciar sesión'}
                        </button>
                    </div>
                    <div className="flex items-center gap-4 my-6">
                        <hr className="flex-grow border-t border-gray-300" />
                        <span className="text-gray-500 text-sm">Ó</span>
                        <hr className="flex-grow border-t border-gray-300" />
                    </div>
                    <div className='flex flex-col w-full justify-around text-[1.2em]'>
                        <div className='w-full h-[70px] mb-5'>
                            <button className="cursor-pointer flex items-center justify-center w-full h-full border border-gray-300 rounded-md py-2 px-4 gap-2 hover:bg-gray-100 transition">
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
                <div className='flex items-center gap-4 my-6 lg:w-5/6 pb-10'>
                    <span className="text-blue-600 text-l underline"><a href="">¿Olvidaste tu contraseña?</a></span>
                    <hr className="flex-grow border-t border-gray-300" />
                    <span className="text-blue-600 text-l underline"><a href="">Ayuda?</a></span>
                </div>
            </div>
        </div>
    </div>
  );
};

export default Login;