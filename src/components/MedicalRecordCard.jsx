const MedicalRecordCard = ({ record, onClick }) => {
  return (
    <div
      className="bg-white shadow-md rounded-xl p-4 hover:shadow-lg transition-shadow duration-200 cursor-pointer border border-gray-100 hover:border-blue-400"
      onClick={() => onClick(record)}
    >
      <div className="flex justify-between items-center mb-2">
        <p className="text-sm text-gray-500">{record.diagnosis_date}</p>
        <span className="text-xs text-white bg-blue-500 px-2 py-0.5 rounded-full">Ver más</span>
      </div>
      <h3 className="text-base font-semibold text-gray-800 mb-1">Observaciones</h3>
      <p className="text-sm text-gray-700 line-clamp-2">{record.observations || 'Sin observaciones'}</p>

      <div className="mt-3 text-sm text-gray-600 space-y-1">
        <p><span className="font-semibold">Incapacidad:</span> {record.incapacidad || 'N/A'}</p>
        <p><span className="font-semibold">Medicamentos:</span> {record.medicamentos || 'Ninguno'}</p>
      </div>
    </div>
  );
};

export default MedicalRecordCard;