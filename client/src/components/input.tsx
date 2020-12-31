import classNames from "classnames";

interface InputProps {
  wrapperClass?: string;
  type: string;
  placeholder: string;
  name: string;
  value: string;
  error: string | undefined;
  handleChange(e: any): void;
}

export default function Input(props: InputProps) {
  // const Input: React.FC<InputProps> = props => {
  const {
    wrapperClass,
    type,
    placeholder,
    name,
    value,
    error,
    handleChange,
  } = props;

  return (
    <div className={wrapperClass || "mb-2"}>
      <input
        type={type}
        className={classNames(
          "w-full p-3 transition duration-200 border border-gray-300 rounded outline-none bg-gray-50 focus:bg-white hover:bg-white",
          { "border-red-500": error }
        )}
        placeholder={placeholder}
        name={name}
        value={value}
        onChange={handleChange}
      />
      <small className="font-medium text-red-600">{error}</small>
    </div>
  );
}
