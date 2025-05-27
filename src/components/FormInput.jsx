const FormInput = ({ id, label, type = "text", value, onChange, options, readOnly = false }) => {
  const isSelect = Array.isArray(options);

  return (
    <div className="relative w-full mb-5">
      {isSelect ? (
        <select
          name={id}
          id={id}
          value={value}
          onChange={onChange}
          disabled={readOnly}
          className={`peer w-full border border-gray-300 rounded-md px-3 pt-5 pb-2.5 text-[1.2em]
            ${readOnly
              ? 'bg-gray-100 cursor-default text-gray-500'
              : 'bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:border-gray-300'}
          `}
        >
          <option value="" disabled>
            -- Selecciona una opción --
          </option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          name={id}
          type={type}
          id={id}
          placeholder=" "
          value={value}
          onChange={onChange}
          readOnly={readOnly}
          className={`peer w-full border border-gray-300 rounded-md px-3 pt-5 pb-2.5 text-[1.2em]
            ${readOnly
              ? 'bg-gray-100 cursor-default text-gray-500 select-none'
              : 'bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:border-gray-300'}
          `}
        />
      )}

      <label
        htmlFor={id}
        className={`absolute left-3 px-1 text-gray-500 text-sm bg-white z-10 transition-all
          peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2
          peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400
          peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-sm peer-focus:text-blue-500 peer-focus:bg-blue-50
          ${readOnly ? 'cursor-default' : 'cursor-text'}
        `}
      >
        {label}
      </label>
    </div>
  );
};

export default FormInput;