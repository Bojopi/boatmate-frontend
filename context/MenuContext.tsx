import { ReactNode, createContext, useState } from 'react';

interface MenuContextProps {
  activeOption: string;
  setActiveOption: (option: string) => void;
  activeSideOption: string;
  setActiveSideOption: (option: string) => void;
}

export const MenuContext = createContext<MenuContextProps>({
  activeOption: '',
  setActiveOption: () => {},
  activeSideOption: '',
  setActiveSideOption: () => {},
});

export const MenuProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeOption, setActiveOption] = useState<string>('welcome');
  const [activeSideOption, setActiveSideOption] = useState<string>('profiles');

  return (
    <MenuContext.Provider value={{ activeOption, setActiveOption, activeSideOption, setActiveSideOption }}>
      {children}
    </MenuContext.Provider>
  );
};