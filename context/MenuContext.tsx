import { ReactNode, createContext, useState } from 'react';

interface MenuContextProps {
  activeOption: number;
  setActiveOption: (option: number) => void;
  activeSideOption: number;
  setActiveSideOption: (option: number) => void;
}

export const MenuContext = createContext<MenuContextProps>({
  activeOption: 0,
  setActiveOption: () => {},
  activeSideOption: 0,
  setActiveSideOption: () => {},
});

export const MenuProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeOption, setActiveOption] = useState<number>(0);
  const [activeSideOption, setActiveSideOption] = useState<number>(0);

  return (
    <MenuContext.Provider value={{ activeOption, setActiveOption, activeSideOption, setActiveSideOption }}>
      {children}
    </MenuContext.Provider>
  );
};