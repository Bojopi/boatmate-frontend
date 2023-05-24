import { ReactNode, createContext, useState } from 'react';

interface MenuContextProps {
  activeOption: string;
  setActiveOption: (option: string) => void;
}

export const MenuContext = createContext<MenuContextProps>({
  activeOption: '',
  setActiveOption: () => {},
});

export const MenuProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeOption, setActiveOption] = useState<string>('welcome');

  return (
    <MenuContext.Provider value={{ activeOption, setActiveOption }}>
      {children}
    </MenuContext.Provider>
  );
};