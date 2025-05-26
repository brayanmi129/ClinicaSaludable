import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Tabs from '../components/Tabs';
import { getCitas } from '../utils/citas';
import { getLabs } from '../utils/laboratorios';

const Home = () => {
  const userData = JSON.parse(sessionStorage.getItem("userData"));
  const [citas, setCitas] = useState([]);
  const navigate = useNavigate();

  const [labResults, setLabResults] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = sessionStorage.getItem('authToken');
        if (!token) throw new Error('No token');
        const [citasData, labsData] = await Promise.all([
          getCitas(token),
          getLabs(token)
        ]);
        setCitas(citasData);
        setLabResults(labsData);
      } catch (err) {
        console.error('Error al cargar datos:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const citasProximas = citas
  .map(c => {
    if (!c.appointment_date || !c.appointment_time) return null;

    const date = new Date(c.appointment_date);
    const time = new Date(c.appointment_time);

    const fechaHora = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      time.getHours(),
      time.getMinutes()
    );

    return { ...c, fechaHora };
  })
  .filter(c => c && !isNaN(c.fechaHora) && c.fechaHora >= new Date())
  .sort((a, b) => a.fechaHora - b.fechaHora);

const citasPasadas = citas
  .map(c => {
    if (!c.appointment_date || !c.appointment_time) return null;

    const date = new Date(c.appointment_date);
    const time = new Date(c.appointment_time);

    const fechaHora = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      time.getHours(),
      time.getMinutes()
    );

    return { ...c, fechaHora };
  })
  .filter(c => c && !isNaN(c.fechaHora) && c.fechaHora < new Date())
  .sort((a, b) => b.fechaHora - a.fechaHora);

  if (loading) {
    return (
      <div className="fixed inset-0 flex flex-col justify-center items-center bg-white z-200">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-lg text-gray-700">Cargando tu información...</p>
      </div>
    );
  }

  const calcularEdad = (fechaNacimiento) => {
  if (!fechaNacimiento) return '';
  const nacimiento = new Date(fechaNacimiento);
  const hoy = new Date();
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const mes = hoy.getMonth() - nacimiento.getMonth();
  if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad--;
  }
  return edad;
};

  return (
    <div className="flex flex-col h-fit pt-4 justify-start">
      <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 auto-rows-auto gap-4 lg:text-sm xl:text-base">
        {/* User Profile */}
        <div className="row-start-5 lg:row-start-3 xl:col-start-1 xl:col-span-1 xl:row-start-1 lg:col-start-1 max-h-[400px] h-[350px] flex flex-col items-center justify-center bg-white py-8 px-5 shadow-lg rounded-lg hover:scale-101 transition-transform duration-200 hover:ring-1 ring-blue-500 cursor-pointer" onClick={() => navigate('/user-profile')}>
          <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mb-4 text-white text-2xl font-normal">
            {userData.firstName?.charAt(0).toUpperCase() || 'U'}
          </div>
          <h2 className="text-lg font-semibold">{userData?.first_name || ''} {userData?.last_name || ''}</h2>
          <p className="text-gray-500">{userData?.email || '' }</p>
          <p className="text-gray-500">{userData?.phone || ''}</p>
        </div>

        {/* General Information */}
        <div className="row-start-4 lg:row-start-3 sm:col-start-1 xl:col-start-2 xl:row-start-1 lg:col-start-2 flex flex-col bg-white py-8 px-5 shadow-lg rounded-lg hover:scale-105 transition-transform duration-200 hover:ring-1 ring-blue-500 overflow-x-auto">
                    <div className='flex items-center justify-between mb-5'>
            <p className="text-lg font-bold">Historia clínica</p>
            <button 
              className='flex items-center gap-2 bg-blue-500 text-white px-3 py-1.5 rounded-md cursor-pointer hover:bg-blue-600 transition duration-200 text-sm'
              onClick={() => navigate('/medic-history?edit=true')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="white" className="size-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
              </svg>
              Editar
            </button>
          </div>
          <table className='w-full table-fixed'>
            <tbody>
              <tr className="border-b border-gray-200 hover:bg-blue-100 h-10 transition duration-200">
                <td className="text-left font-semibold px-3 w-[30%] text-sm lg:text-base">Tu ID:</td>
                <td className="text-left font-normal px-3 truncate max-w-full text-sm lg:text-base">{userData?.user_id || ''}</td>
              </tr>
              <tr className="border-b border-gray-200 hover:bg-blue-100 h-10 transition duration-200">
                <td className="text-left font-semibold px-3 text-sm lg:text-base">Dirección:</td>
                <td className="text-left font-normal px-3 break-words max-w-full text-sm lg:text-base">{userData?.address || ''}</td>
              </tr>
              <tr className="border-b border-gray-200 hover:bg-blue-100 h-10 transition duration-200">
                <td className="text-left font-semibold px-3 text-sm lg:text-base truncate">Edad</td>
                <td className="text-left font-normal px-3 truncate max-w-full text-sm lg:text-base">{userData?.birth_date ? `${calcularEdad(userData.birth_date)} años` : ''}</td>
              </tr>
              <tr className="border-b border-gray-200 hover:bg-blue-100 h-10 transition duration-200">
                <td className="text-left font-semibold px-3 text-sm lg:text-base">Correo:</td>
                <td className="text-left font-normal px-3 truncate max-w-full text-sm lg:text-base">{userData?.email || ''}</td>
              </tr>
              <tr className="border-b border-gray-200 hover:bg-blue-100 h-10 transition duration-200">
                <td className="text-left font-semibold px-3 text-sm lg:text-base">Teléfono:</td>
                <td className="text-left font-normal px-3 max-w-full text-sm lg:text-base">{userData?.phone || ''}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Medical History */}
        <div className="row-start-3 sm:col-start-1 xl:col-start-3 xl:row-start-1 lg:col-start-2 lg:row-start-2 flex flex-col bg-white py-8 px-5 shadow-lg rounded-lg hover:scale-101 transition-transform duration-200 hover:ring-1 ring-blue-500">
          <div className='flex items-center justify-between mb-5'>
            <p className="text-lg font-bold">Historia clínica</p>
            <button 
              className='flex items-center gap-2 bg-blue-500 text-white px-3 py-1.5 rounded-md cursor-pointer hover:bg-blue-600 transition duration-200 text-sm'
              onClick={() => navigate('/medic-history?edit=true')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="white" className="size-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
              </svg>
              Editar
            </button>
          </div>
          <table className='w-full h-fit'>
            <tbody>
              <tr className="border-b border-gray-200 py-2 hover:bg-blue-100 h-10 transition duration-200">
                <td className="text-left font-semibold px-3 text-sm lg:text-base">Alergias: </td>
                <td className="text-left font-normal">{userData?.allergies || ''}</td>
              </tr>
              <tr className="border-b border-gray-200 py-2 hover:bg-blue-100 h-10 transition duration-200">
                <td className="text-left font-semibold px-3 text-sm lg:text-base">RH: </td>
                <td className="text-left font-normal">{userData?.blood_type || ''}</td>
              </tr>
              <tr className="border-b border-gray-200 py-2 hover:bg-blue-100 h-10 transition duration-200">
                <td className="text-left font-semibold px-3 text-sm lg:text-base">Seguro: </td>
                <td className="text-left font-normal">{userData?.health_insurance || ''}</td>
              </tr>
              <tr className="border-b border-gray-200 py-2 hover:bg-blue-100 h-10 transition duration-200">
                <td className="text-left font-semibold px-3 text-sm lg:text-base">Doctor: </td>
                <td className="text-left font-normal">{userData?.doctor_id || ''}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Appointments */}
        <div className="row-start-1 lg:col-span-2 xl:col-start-1 xl:col-span-2 xl:row-start-2 lg:col-start-1 lg:row-start-1 max-h-[400px] h-[350px] flex flex-col items-center justify-center bg-white py-8 px-5 shadow-lg rounded-lg hover:scale-101 transition-transform duration-200 hover:ring-1 ring-blue-500">
          <div className='flex w-full max-h-1/6 items-center py-2 justify-between'>
            <div className='w-fit h-fit'>
              <p className="text-lg font-bold">Tus citas</p>
            </div>
            <div 
              className="flex items-center gap-2 bg-blue-500 text-white px-3 py-1.5 rounded-md cursor-pointer hover:bg-blue-600 transition duration-200 shadow-sm text-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Agendar nueva cita
            </div>
          </div>
          <div className="flex-1 w-full mt-2">
            <Tabs 
              tab1Name="Citas próximas" 
              tab2Name="Citas pasadas" 
              citasTab1={citasProximas} 
              citasTab2={citasPasadas} 
            />
          </div>
        </div>

        {/* Lab results */}
        <div className="row-start-2 sm:col-start-1 xl:col-start-3 xl:col-span-1 xl:row-start-2 lg:col-start-1 lg:row-start-2 max-h-[400px] h-[350px] flex flex-col bg-white py-8 px-5 shadow-lg rounded-lg hover:scale-101 transition-transform duration-200 hover:ring-1 ring-blue-500">
          <div className='flex items-center gap-5 h-fit'>
            <div>
              <p className="text-lg font-bold mb-5">Tus resultados</p>
            </div>
          </div>
          <div className='flex flex-col gap-5 w-full h-full overflow-y-auto px-2'>
            {labResults.length === 0 ? (
              <p className='text-gray-500'>No hay resultados disponibles.</p>
            ) : (
              labResults.map((result, index) => (
                <div
                  className="flex flex-row gap-2 justify-between items-center border-b border-gray-200 hover:bg-blue-100 transition duration-200 py-2"
                  key={index}
                >
                  <div className="flex items-center gap-4 max-w-[60%] min-w-0">
                    <div className='w-6 h-6 text-blue-500'>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className='w-8 h-8'>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                      </svg>
                    </div>
                    <div className='flex flex-col truncate'>
                      <p className='text-xs lg:text-sm text-gray-500'>{new Date(result.lab_date).toISOString().split('T')[0]}</p>
                      <p className='font-semibold truncate text-sm lg:text-base' title={result.lab_name}>{result.lab_name}</p>
                    </div>
                  </div>
                  <div className="w-fit h-full flex items-center justify-center">
                    <button
                      className="cursor-pointer h-[35px] bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg flex items-center gap-2 text-sm transition duration-200 shadow-sm hover:shadow-md"
                      onClick={() => window.open(result.file_link, '_blank')}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-6 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.25 12s3.75-6.75 9.75-6.75S21.75 12 21.75 12s-3.75 6.75-9.75 6.75S2.25 12 2.25 12z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 15.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5z"
                        />
                      </svg>
                      Ver
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;