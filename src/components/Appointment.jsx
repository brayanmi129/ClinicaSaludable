const Appointment = ({ date, time, doctor, service, status }) => {
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
    <div
      className={`hover:ring hover:ring-blue-400 hover:ring-offset-1 transition-transform duration-200 cursor-pointer min-h-15 w-full rounded-md flex items-stretch ${statusColor} py-2`}
    >
      <div className={`w-[20%] flex flex-col justify-center px-2 border-r ${dividerColor}`}>
        <span className="text-sm text-gray-700">{date}</span>
        <span className="text-md font-semibold break-words text-gray-900">{time}</span>
      </div>
      <div className={`w-[30%] flex flex-col justify-center px-2 border-r ${dividerColor}`}>
        <span className="text-sm text-gray-700">Servicio</span>
        <span className="text-md font-semibold break-words text-gray-900">{service}</span>
      </div>
      <div className={`w-[25%] flex flex-col justify-center px-2 border-r ${dividerColor}`}>
        <span className="text-sm text-gray-700">Doctor</span>
        <span className="text-md font-semibold break-words text-gray-900">{doctor}</span>
      </div>
      <div className={`w-[25%] flex flex-col justify-center px-2`}>
        <span className="text-sm text-gray-700">Estado</span>
        <span className="text-md font-semibold break-words text-gray-900">{estadoTraducido[status] || 'Desconocido'}</span>
      </div>
    </div>
  );
};

export default Appointment;