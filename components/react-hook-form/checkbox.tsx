import {useFormContext} from "react-hook-form";
export type CheckboxProps = {
  id: string;
  name: string;
  label: string;
  value: string;
  rules?: Record<string, any>;
};

export const Checkbox: React.FC<CheckboxProps> = ({
  id,
  label,
  name,
  value,
  rules = {},
}) => {
  const {register} = useFormContext();
  return (
    <div className="flex items-center space-x-2">
      <div className="flex items-center h-6">
        <input
          {...register(name, rules)}
          id={id}
          name={name}
          value={value}
          type="checkbox"
          className="w-4 h-4 text-blue-600 border-gray-300 rounded form-checkbox focus:ring-blue-500"
        />
      </div>
      <div className="text-sm space-y-1">
        <div className="shrink-0 block font-medium text-gray-700 whitespace-nowrap">
          {label}
        </div>
      </div>
    </div>
  );
};
