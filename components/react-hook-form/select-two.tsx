import {useFormContext} from "react-hook-form";

export interface OptionProps {
    id: any;
    name: any;
}

export type SelectProps = {
    id: string;
    name: string;
    options: OptionProps[];
    width?: string;
    rules?: Record<string, any>;
};

export const SelectTwo: React.FC<SelectProps> = ({
     id,
     name,
     options,
     rules = {},
     width = "w-full",
 }) => {
    const {register} = useFormContext();
    return (
        <select
            {...register(name, rules)}
            id={id}
            name={name}
            className={`block ${width} border-gray-300 bg-white dark:bg-gray-800 dark:border-gray-700 form-select focus:ring-blue-500 focus:border-blue-500 focus:ring-0 sm:text-sm rounded-md`}>
            {options.map((option) => (
                <option key={option.id} value={option.id}>
                    {option.name}
                </option>
            ))}
        </select>
    );
};
