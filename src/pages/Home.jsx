import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Tabs from '../components/Tabs';
import { getAllAppointments, createAppointment } from '../utils/appointments';
import { getAllDoctors } from '../utils/doctors';
import { getLabs } from '../utils/laboratorios';
import Modal from '../components/Modal';
import FormInput from '../components/FormInput';
import { updateUserInfo } from '../utils/users';
import { getUserDataFromToken } from '../utils/auth';
import { getMedicalHistory } from '../utils/history';

const Home = () => {
  document.title = "Dashboard - Clinica del Norte";
  const userData = JSON.parse(sessionStorage.getItem("userData"));
  const [citas, setCitas] = useState([]);
  const [labResults, setLabResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModalAgendar, setShowModalAgendar] = useState(false);
  const [showModalEditarInfo, setShowModalEditarInfo] = useState(false);
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [motivo, setMotivo] = useState('');
  const [errores, setErrores] = useState({});
  const [doctores, setDoctores] = useState([]);
  const [direccionEdit, setDireccionEdit] = useState(userData?.address || '');
  const [telefonoEdit, setTelefonoEdit] = useState(userData?.phone || '');
  const [emailEdit, setEmailEdit] = useState(userData?.email || '');
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [showModalResultado, setShowModalResultado] = useState(false);
  const [resultadoSeleccionado, setResultadoSeleccionado] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = sessionStorage.getItem('authToken');
        if (!token) throw new Error('No token');

        const [citasData, labsData, doctoresData, recordsData] = await Promise.all([
          getAllAppointments(token),
          getLabs(token),
          getAllDoctors(token),
          getMedicalHistory(token, userData.user_id)
        ]);

        setCitas(citasData);
        setLabResults(labsData);
        setDoctores(doctoresData);
        setMedicalRecords(recordsData);
      } catch (err) {
        console.error('Error al cargar datos:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const obtenerDoctorAleatorio = () => {
    if (!doctores.length) return null;
    const randomIndex = Math.floor(Math.random() * doctores.length);
    return doctores[randomIndex];
  };

  const buscarDoctorPorID = (id) => {
    if (!doctores || doctores.length === 0) return "Error.";

    const doctor = doctores.find(doc => {
      console.log("Comparando", String(doc.user_id), "con", String(id));
      return String(doc.user_id) === String(id);
    });

    console.log("Doctor encontrado:", doctor);

    return doctor ? `${doctor.first_name} ${doctor.last_name}` : "Doctor no encontrado";
  };

  const todasLasHoras = [
    '08:00', '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00'
  ];

  const tiposCita = [
    { label: 'Medicina General', value: 'Medicina General' },
    { label: 'Odontología', value: 'Odontologia' },
    { label: 'Pediatría', value: 'Pediatria' },
    { label: 'Dermatología', value: 'Dermatologia' },
    { label: 'Cardiología', value: 'Cardiologia' }
  ];

  const citasPlanas = Array.isArray(citas[0]) ? citas.flat() : citas;

  const procesarCitas = (lista, esFutura = true) => {
    return lista
      .map(c => {
        if (!c.appointment_date || !c.appointment_time) return null;

        const fechaUTC = new Date(c.appointment_date); // "2025-05-27T00:00:00.000Z"
        const horaUTC = new Date(c.appointment_time);  // "1970-01-01T08:00:00.000Z"

        const fechaHora = new Date(
          Date.UTC(
            fechaUTC.getUTCFullYear(),
            fechaUTC.getUTCMonth(),
            fechaUTC.getUTCDate(),
            horaUTC.getUTCHours(),
            horaUTC.getUTCMinutes()
          )
        );

        return { ...c, fechaHora };
      })
      .filter(c => c && !isNaN(c.fechaHora) && (
        esFutura ? c.fechaHora >= new Date() : c.fechaHora < new Date()
      ))
      .sort((a, b) => esFutura
        ? a.fechaHora - b.fechaHora
        : b.fechaHora - a.fechaHora
      );
  };

  const citasProximas = procesarCitas(citasPlanas, true);
  const citasPasadas = procesarCitas(citasPlanas, false);

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

  const citasOcupadasPorFecha = citas.reduce((acc, cita) => {
    if (!cita.appointment_date || !cita.appointment_time) return acc;

    const fecha = new Date(cita.appointment_date).toISOString().split('T')[0];
    const hora = new Date(cita.appointment_time).toTimeString().slice(0, 5);

    if (!acc[fecha]) acc[fecha] = [];
    acc[fecha].push(hora);

    return acc;
  }, {});

  const cerrarModalAgendar = () => {
    setShowModalAgendar(false);
  };

  const agendarCita = async () => {
    if (!validarFormulario()) return;

    const doctorAsignado = obtenerDoctorAleatorio();
    if (!doctorAsignado) {
      alert("No se pudo asignar un doctor. Intenta más tarde.");
      return;
    }

    const token = sessionStorage.getItem("authToken");
    const userId = userData?.user_id;

    const ubicacionesDisponibles = [
      "Consultorio 1A",
      "Consultorio 2B",
      "Consultorio 3C",
      "Consultorio 4D",
      "Consultorio 5E"
    ];

    const locationAleatoria = ubicacionesDisponibles[Math.floor(Math.random() * ubicacionesDisponibles.length)];

    const nuevaCita = {
      appointment_date: fecha,          
      appointment_time: hora + ':00', 
      appointment_type: motivo,        
      doctor_id: doctorAsignado.user_id, 
      patient_id: userId,
      location: locationAleatoria,
      status: "SCHEDULED"
    };

    try {
      await createAppointment(token, nuevaCita);
      alert("Cita agendada exitosamente");
      cerrarModalAgendar();
      location.reload();
    } catch (error) {
      console.error("Error al crear la cita:", error);
      alert("Hubo un problema al agendar la cita.");
    }
  };

  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!fecha) nuevosErrores.fecha = "La fecha es obligatoria";
    if (!hora) nuevosErrores.hora = "La hora es obligatoria";
    if (!motivo.trim()) nuevosErrores.motivo = "El motivo es obligatorio";

    setErrores(nuevosErrores);

    return Object.keys(nuevosErrores).length === 0;
  };

  const handleActualizarInfo = async () => {
    try {
      const token = sessionStorage.getItem("authToken");

      await updateUserInfo(token, {
        user_id: userData.user_id,
        address: direccionEdit,
        phone: telefonoEdit,
      });

      const updatedUser = await getUserDataFromToken(token);

      sessionStorage.setItem("userData", JSON.stringify(updatedUser));

      alert("Información actualizada correctamente.");
      setShowModalEditarInfo(false);
      window.location.reload();

    } catch (error) {
      console.error("Error actualizando la información:", error);
      alert(error.message);
    }
  };

  const abrirModalResultado = (resultado) => {
    setResultadoSeleccionado(resultado);
    setShowModalResultado(true);
  };

  const cerrarModalResultado = () => {
    setShowModalResultado(false);
    setResultadoSeleccionado(null);
  };

  return (
    <div className="flex flex-col h-fit pt-4 justify-start">
      <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 auto-rows-auto gap-4 lg:text-sm xl:text-base">
        {/* User Profile */}
        <div className="row-start-5 lg:row-start-3 xl:col-start-1 xl:col-span-1 xl:row-start-1 lg:col-start-1 max-h-[400px] h-[350px] flex flex-col items-center justify-center bg-white py-8 px-5 shadow-lg rounded-lg hover:scale-101 transition-transform duration-200 hover:ring-1 ring-blue-500 cursor-pointer">
          <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mb-4 text-white text-2xl font-normal">
            {userData.firstName?.charAt(0).toUpperCase() || 'U'}
          </div>
          <h2 className="text-lg font-semibold">{userData?.first_name || ''} {userData?.last_name || ''}</h2>
          <p className="text-gray-500">{userData?.email || '' }</p>
          <p className="text-gray-500">{userData?.phone || ''}</p>
        </div>

        {/* General Information */}
        <div className="row-start-4 lg:row-start-3 sm:col-start-1 xl:col-start-2 xl:row-start-1 lg:col-start-2 flex flex-col bg-white py-8 px-5 shadow-lg rounded-lg hover:scale-101 transition-transform duration-200 hover:ring-1 ring-blue-500 overflow-x-auto">
          <div className='flex items-center justify-between mb-5'>
            <p className="text-lg font-bold">Tu información</p>
              <button 
                className='flex items-center gap-2 bg-blue-500 text-white px-3 py-1.5 rounded-md cursor-pointer hover:bg-blue-600 transition duration-200 text-sm'
                onClick={() => setShowModalEditarInfo(true)}
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
        <div className="row-start-2 sm:col-start-1 xl:col-start-3 xl:col-span-1 xl:row-start-1 lg:col-start-1 lg:row-start-2 max-h-[400px] h-[350px] flex flex-col bg-white py-8 px-5 shadow-lg rounded-lg hover:scale-101 transition-transform duration-200 hover:ring-1 ring-blue-500">
          <div className='flex items-center gap-5 h-fit'>
            <div>
              <p className="text-lg font-bold mb-5">Tus visitas</p>
            </div>
          </div>
          <div className='flex flex-col gap-5 w-full h-full overflow-y-auto px-2'>
            {labResults.length === 0 ? (
              <p className='text-gray-500'>No hay resultados disponibles.</p>
            ) : (
              medicalRecords.map((result, index) => (
                <div
                  className="flex flex-row gap-2 justify-between items-center border-b border-gray-200 hover:bg-blue-100 transition duration-200 py-2"
                  key={index}
                >
                  <div className="flex items-center gap-4 max-w-[60%] min-w-0">
                    <div className='w-6 h-6 text-blue-500'>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 2.994v2.25m10.5-2.25v2.25m-14.252 13.5V7.491a2.25 2.25 0 0 1 2.25-2.25h13.5a2.25 2.25 0 0 1 2.25 2.25v11.251m-18 0a2.25 2.25 0 0 0 2.25 2.25h13.5a2.25 2.25 0 0 0 2.25-2.25m-18 0v-7.5a2.25 2.25 0 0 1 2.25-2.25h13.5a2.25 2.25 0 0 1 2.25 2.25v7.5m-6.75-6h2.25m-9 2.25h4.5m.002-2.25h.005v.006H12v-.006Zm-.001 4.5h.006v.006h-.006v-.005Zm-2.25.001h.005v.006H9.75v-.006Zm-2.25 0h.005v.005h-.006v-.005Zm6.75-2.247h.005v.005h-.005v-.005Zm0 2.247h.006v.006h-.006v-.006Zm2.25-2.248h.006V15H16.5v-.005Z" />
                      </svg>
                    </div>
                    <div className='flex flex-col truncate'>
                      <p className='text-xs lg:text-sm text-gray-500'>{new Date(result.diagnosis_date).toISOString().split('T')[0]}</p>
                      <p className='font-semibold truncate text-sm lg:text-base' title={result.observations}>{result.observations}</p>
                    </div>
                  </div>
                  <div className="w-fit h-full flex items-center justify-center">
                    <button
                      className="cursor-pointer h-[35px] bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg flex items-center gap-2 text-sm transition duration-200 shadow-sm hover:shadow-md"
                      onClick={() => abrirModalResultado(result)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                      </svg>
                      Detalles
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Appointments */}
        <div className="row-start-1 lg:col-span-2 xl:col-start-1 xl:col-span-2 xl:row-start-2 lg:col-start-1 lg:row-start-1 max-h-[400px] h-[350px] flex flex-col items-center justify-center bg-white py-8 px-5 shadow-lg rounded-lg hover:scale-101 transition-transform duration-200 hover:ring-1 ring-blue-500">
          <div className='flex w-full max-h-1/6 items-center py-2 justify-between'>
            <div className='w-fit h-fit'>
              <p className="text-lg font-bold">Tus citas</p>
            </div>
            <div 
              className="flex items-center gap-2 bg-blue-500 text-white px-3 py-1.5 rounded-md cursor-pointer hover:bg-blue-600 transition duration-200 shadow-sm text-sm"
              onClick={() => setShowModalAgendar(true)}
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
              horasOcupadas={citasOcupadasPorFecha}
            />
          </div>
        </div>

        {/* Lab results */}
        <div className="row-start-3 sm:col-start-1 xl:col-start-3 xl:col-span-1 xl:row-start-2 lg:col-start-1 lg:row-start-2 max-h-[400px] h-[350px] flex flex-col bg-white py-8 px-5 shadow-lg rounded-lg hover:scale-101 transition-transform duration-200 hover:ring-1 ring-blue-500">
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

        {/* Modals */}
        
        {/* Modal Agendar Cita */}
        {showModalAgendar && (
          <Modal isOpen={!!showModalAgendar} onClose={cerrarModalAgendar}>
            <div className="flex justify-between items-center mb-6 border-b border-gray-300 pb-2">
              <h2 className="text-lg font-semibold text-gray-900">Agenda tu cita</h2>
              <button
                onClick={cerrarModalAgendar}
                aria-label="Cerrar modal"
                className="cursor-pointer text-gray-500 hover:text-gray-900 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <FormInput
                id="fecha"
                label="Fecha de la cita"
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
              />
              <FormInput
                id="hora"
                label="Hora de la cita"
                value={hora}
                onChange={(e) => setHora(e.target.value)}
                options={todasLasHoras.map(hora => ({ label: hora, value: hora }))}
              />
              <FormInput
                id="motivo"
                label="Motivo de la cita"
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                options={tiposCita}
              />
              <div className="flex justify-end mt-4">
                <button
                  onClick={agendarCita}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition duration-200"
                >
                  Agendar
                </button>
              </div>
            </div>
          </Modal>
        )}

        {/* Modal Editar Información */}
        {showModalEditarInfo && (
          <Modal isOpen={!!showModalEditarInfo} onClose={() => setShowModalEditarInfo(false)}>
            <div className="flex justify-between items-center mb-6 border-b border-gray-300 pb-2">
              <h2 className="text-lg font-semibold text-gray-900">Editar Información General</h2>
              <button
                onClick={() => setShowModalEditarInfo(false)}
                aria-label="Cerrar modal"
                className="cursor-pointer text-gray-500 hover:text-gray-900 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <FormInput
                id="direccion"
                label="Dirección"
                type="text"
                value={direccionEdit}
                onChange={(e) => setDireccionEdit(e.target.value)}
              />
              <FormInput
                id="telefono"
                label="Teléfono"
                type="tel"
                value={telefonoEdit}
                onChange={(e) => setTelefonoEdit(e.target.value)}
              />
              <FormInput
                id="email"
                label="Correo electrónico"
                type="email"
                value={emailEdit}
                onChange={(e) => setEmailEdit(e.target.value)}
              />
              <div className="flex justify-end mt-4">
                <button
                  onClick={handleActualizarInfo}
                  className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition duration-200"
                >
                  Guardar cambios
                </button>
              </div>
            </div>
          </Modal>
        )}

        {/* Modal Historia Clinica */}
          {showModalResultado && resultadoSeleccionado && (
            <Modal isOpen={!!showModalResultado} onClose={() => setShowModalResultado(false)}>
              <div className="flex justify-between items-center mb-6 border-b border-gray-300 pb-2">
                <h2 className="text-lg font-semibold text-gray-900">Detalle del Resultado Médico</h2>
                <button
                  onClick={() => setShowModalResultado(false)}
                  aria-label="Cerrar modal"
                  className="cursor-pointer text-gray-500 hover:text-gray-900 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <FormInput
                  id="fecha"
                  label="Fecha de diagnóstico"
                  type="text"
                  value={new Date(resultadoSeleccionado.diagnosis_date).toLocaleDateString()}
                  readOnly
                />
                <FormInput
                  id="observaciones"
                  label="Observaciones"
                  type="text"
                  value={resultadoSeleccionado.observations}
                  readOnly
                />
                <FormInput
                  id="doctor"
                  label="Doctor"
                  type="text"
                  value={buscarDoctorPorID(resultadoSeleccionado.doctor_id) || 'N/A'}
                  readOnly
                />
                <FormInput
                  id="incapacidad"
                  label="Incapacidad"
                  type="text"
                  value={resultadoSeleccionado.incapacidad || 'N/A'}
                  readOnly
                />
                <FormInput
                  id="medicamentos"
                  label="Medicamentos"
                  type="text"
                  value={resultadoSeleccionado.medicamentos || 'N/A'}
                  readOnly
                />
                <div className="flex justify-end mt-4">
                  <button
                    onClick={() => setShowModalResultado(false)}
                    className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition duration-200"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </Modal>
          )} 
      </div>
    </div>
  );
};

export default Home;