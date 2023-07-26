import {useFormContext} from "react-hook-form";
export type TextareaProps = {
  id: string;
  name: string;
  rules?: Record<string, any>;
  rows?: number;
  placeholder?: string;
  width?: string;
  readonly?: boolean;
  onClick?: (e: any) => void;
};

export const Textarea: React.FC<TextareaProps> = ({
  id,
  name,
  rules = {},
  rows = 2,
  placeholder = "",
  width = "w-full",
  readonly = false,
  onClick,
}) => {
  const {register} = useFormContext();
  return (
    <textarea
      {...register(name, rules)}
      id={id}
      name={name}
      rows={rows}
      placeholder={placeholder}
      className={`p-inputtext p-inputtextarea w-full read-only:border-none read-only:focus:shadow-none`}
      readOnly={readonly}
      onClick={onClick}
    />
  );
};
