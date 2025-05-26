import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const Appointment = ({ date, time, doctor, service, location, status }) => {
  const statusColor = {
    SCHEDULED: 'bg-yellow-100 border-l-4 border-yellow-400',
    COMPLETED: 'bg-green-100 border-l-4 border-green-400',
    MISSED: 'bg-red-100 border-l-4 border-red-400',
    CANCELED: 'bg-red-100 border-l-4 border-red-400',
  }[status] || 'bg-gray-100 border-l-4 border-gray-400';

  const dividerColor = {
    SCHEDULED: 'border-yellow-400',
    COMPLETED: 'border-green-400',
    MISSED: 'border-red-400',
    CANCELED: 'border-red-400',
  }[status] || 'border-gray-400';

  const estadoTraducido = {
    SCHEDULED: 'Programada',
    COMPLETED: 'Completada',
    MISSED: 'Perdida',
    CANCELED: 'Cancelada',
  };

  return (
    <div className={`w-full flex items-stretch rounded-md py-2 ${statusColor}`}>
      {/* Fecha y hora */}
      <div className={`text-sm lg:text-base w-[20%] md:w-[10%] flex flex-col justify-center px-2 border-r ${dividerColor}`}>
        <span className="text-xs text-gray-700 truncate">{date}</span>
        <span className="text-md font-semibold text-gray-900 truncate">{time}</span>
      </div>

      {/* Servicio */}
      <div className={`text-sm lg:text-base w-[40%] md:w-[25%] flex flex-col justify-center px-2 border-r ${dividerColor}`}>
        <span className="text-sm text-gray-700">Servicio</span>
        <span className="text-md font-semibold text-gray-900 truncate">{service}</span>
      </div>

      {/* Doctor - oculto por debajo de md */}
      <div className="text-sm lg:text-base hidden md:flex md:w-[20%] flex-col justify-center px-2 border-r border-gray-300">
        <span className="text-sm text-gray-700">Doctor</span>
        <span className="text-md font-semibold text-gray-900 truncate">{doctor}</span>
      </div>

      {/* Consultorio */}
      <div className={`text-sm lg:text-base w-[30%] md:w-[20%] flex flex-col justify-center px-2 border-r ${dividerColor}`}>
        <span className="text-sm text-gray-700">Consultorio</span>
        <span className="text-md font-semibold text-gray-900 truncate">{location}</span>
      </div>

      {/* Estado - oculto por debajo de md */}
      <div className="hidden md:flex md:w-[20%] flex-col justify-center px-2 border-r border-gray-300">
        <span className="text-sm text-gray-700">Estado</span>
        <span className="text-md font-semibold text-gray-900 truncate">
          {estadoTraducido[status] || 'Desconocido'}
        </span>
      </div>

      {/* Icono de detalles */}
      <button
        type="button"
        aria-label="Ver detalles"
        className="w-[10%] md:w-[5%] flex items-center justify-center text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
      >
        <MagnifyingGlassIcon className="h-6 w-6" />
      </button>
    </div>
  );
};

export default Appointment;