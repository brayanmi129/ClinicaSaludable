import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const Calendar = ({ horasOcupadas, fechaSeleccionada, horaSeleccionada, onFechaYHoraSeleccionadas }) => {
  const todasLasHoras = [
    '08:00', '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00'
  ];

  const formatFechaLocal = (date) => {
    if (!date) return '';
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleFechaChange = (date) => {
    onFechaYHoraSeleccionadas(date, '');
  };

  const handleHoraClick = (hora) => {
    if (!horasOcupadas[formatFechaLocal(fechaSeleccionada)]?.includes(hora)) {
      onFechaYHoraSeleccionadas(fechaSeleccionada, hora);
    }
  };

  const horasOcupadasDelDia = fechaSeleccionada
    ? horasOcupadas[formatFechaLocal(fechaSeleccionada)] || []
    : [];

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <h2 className="text-lg font-semibold mb-4">Calendario</h2>
      <DatePicker
        selected={fechaSeleccionada}
        onChange={handleFechaChange}
        inline
        minDate={new Date()}
        className="border border-gray-300 rounded-lg p-2"
      />

      {fechaSeleccionada && (
        <div className="mt-4 w-full flex flex-wrap gap-2 justify-center">
          {todasLasHoras.map(hora => {
            const ocupada = horasOcupadasDelDia.includes(hora);
            return (
              <button
                key={hora}
                onClick={() => handleHoraClick(hora)}
                disabled={ocupada}
                className={`px-3 py-1 rounded border text-sm
                  ${ocupada
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : hora === horaSeleccionada
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-100'}
                `}
              >
                {hora}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Calendar;