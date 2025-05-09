import Spinner from "./Spinner";

const variantStyles = {
  primary: "bg-blue-600 hover:bg-blue-700 text-white cursor-pointer",
  secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800 cursor-pointer",
  danger: "bg-red-600 hover:bg-red-700 text-white cursor-pointer",
};

const Button = ({
  children,
  onClick,
  isLoading = false,
  disabled = false,
  type = "button",
  variant = "primary",
}) => {
  const baseStyles = `
    w-full mt-4 py-3 px-4 rounded-md text-[1.1em] font-semibold transition duration-300 ease-in-out
    flex items-center justify-center
    focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-60
  `;

  const selectedVariant = variantStyles[variant] || variantStyles.primary;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${baseStyles} ${selectedVariant} focus:ring-${variant === "secondary" ? "gray" : "blue"}-400`}
    >
      {isLoading ? (
        <>
          <Spinner /> Cargando...
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;