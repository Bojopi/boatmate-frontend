import { ReactNode, createContext, useState } from 'react';

interface SearchServiceContextProps {
  name: string;
  setName: (option: string) => void;
  zip: number | any;
  setZip: (option: number) => void;
}

export const SearchServiceContext = createContext<SearchServiceContextProps>({
  name: '',
  setName: () => {},
  zip: null,
  setZip: () => {},
});

export const SearchServiceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [name, setName] = useState<string>('');
  const [zip, setZip] = useState<number | any>(null);

  return (
    <SearchServiceContext.Provider value={{ name, setName, zip, setZip }}>
      {children}
    </SearchServiceContext.Provider>
  );
};