export type LabelProps = {
  id?: string;
  children: React.ReactNode;
  className?: string;
};

export const Label: React.FC<LabelProps> = ({ id, children, className }) => {
  if (!id) {
    return (
      <div className={`block text-sm font-medium text-gray-700 whitespace-nowrap ${className}`}>
        {children}
      </div>
    );
  }
  return (
    <label
      htmlFor={id}
      className={`block text-sm font-medium text-gray-700 whitespace-nowrap ${className}`}>
      {children}
    </label>
  );
};
