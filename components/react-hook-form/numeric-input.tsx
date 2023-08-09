import { InputNumber } from "primereact/inputnumber";
import {useFormContext} from "react-hook-form";
export type NumericInputProps = {
  id: string;
  name: string;
  rules?: Record<string, any>;
  step?: number;
  width?: string;
  placeholder?: string;
};

export const NumericInput: React.FC<NumericInputProps> = ({
  id,
  name,
  rules,
  step = 0.01,
  width = "w-full",
  placeholder = "00.00",
}) => {
  const {register} = useFormContext();
  return (
    <input
      {...register(name, rules)}
      type="number"
      name={name}
      id={id}
      step={step}
      placeholder={placeholder}
      className={`text-6xl ${width} text-center border-none outline-none`}
    />
  );
};
