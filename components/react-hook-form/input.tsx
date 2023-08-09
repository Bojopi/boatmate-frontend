import { useFormContext } from "react-hook-form";
export type InputProps = {
  id: string;
  name: string;
  type:
  | "text"
  | "email"
  | "url"
  | "password"
  | "date"
  | "datetime-local"
  | "month"
  | "search"
  | "tel"
  | "time"
  | "week";
  rules?: Record<string, any>;
  width?: string;
  placeholder?: string;
  maxLength?: number;
  min?: number | string;
  max?: number | string;
  step?: string;
  readonly?: boolean;
  onClick?: (e: any) => void;
};

export const Input: React.FC<InputProps> = ({
  id,
  name,
  type,
  rules = {},
  width = "w-full",
  placeholder = "",
  maxLength = 35,
  min,
  max,
  step,
  readonly,
  onClick,
}) => {
  const { register } = useFormContext();
  return (
    <input
      {...register(name, rules)}
      placeholder={placeholder}
      type={type}
      name={name}
      id={id}
      maxLength={maxLength}
      min={min}
      max={max}
      step={step}
      className={`p-inputtext w-full read-only:focus:shadow-none`}
      readOnly={readonly}
      onClick={onClick}
      // className={`form-input block ${width} border-gray-300 bg-white flex-grow-1 focus:border-blue-500 focus:ring-0 sm:text-sm rounded-md`}
    />
  );
};
