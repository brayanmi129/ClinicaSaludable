const FormInput = ({ id, label, type = "text", value, onChange }) => {
    return (
      <div className="relative w-full mb-5">
        <input
          name={id}
          type={type}
          id={id}
          placeholder=" "
          value={value}
          onChange={onChange}
          className="peer w-full border border-gray-300 rounded-md px-3 pt-5 pb-2.5 text-[1.2em] bg-white
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <label
          htmlFor={id}
          className="cursor-text absolute left-3 px-1 text-gray-500 text-sm bg-white z-10 transition-all
          peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2
          peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400
          peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-sm peer-focus:text-blue-500 peer-focus:bg-blue-50"
        >
          {label}
        </label>
      </div>
    );
};
  
export default FormInput;