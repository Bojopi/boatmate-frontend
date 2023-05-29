import { ReactNode, createContext, useState } from 'react';

interface FormContextProps {
  email: string;
  setEmail: (option: string) => void;
  password: string;
  setPassword: (option: string) => void;
  idRole: number;
  setIdRole: (option: number) => void;
  personName: string;
  setPersonName: (option: string) => void;
  lastname: string;
  setLastname: (option: string) => void;
  phone: string;
  setPhone: (option: string) => void;
  lat: number;
  setLat: (option: number) => void;
  lng: number;
  setLng: (option: number) => void;
  providerName: string;
  setProviderName: (option: string) => void;
  services: any;
  setServices: (option: any) => void;
}

export const FormContext = createContext<FormContextProps>({
    email: '',
    setEmail: () => {},
    password: '',
    setPassword: () => {},
    idRole: 0,
    setIdRole: () => {},
    personName: '',
    setPersonName: () => {},
    lastname: '',
    setLastname: () => {},
    phone: '',
    setPhone: () => {},
    lat: 0,
    setLat: () => {},
    lng: 0,
    setLng: () => {},
    providerName: '',
    setProviderName: () => {},
    services: [],
    setServices: () => {},
});

export const FormProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [idRole, setIdRole] = useState<number>(0);
  const [personName, setPersonName] = useState<string>('');
  const [lastname, setLastname] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [lat, setLat] = useState<number>(0);
  const [lng, setLng] = useState<number>(0);
  const [providerName, setProviderName] = useState<string>('');
  const [services, setServices] = useState<any>([]);

  return (
    <FormContext.Provider value={{
        email,
        setEmail,
        password,
        setPassword,
        idRole,
        setIdRole,
        personName,
        setPersonName,
        lastname,
        setLastname,
        phone,
        setPhone,
        lat,
        setLat,
        lng,
        setLng,
        providerName,
        setProviderName,
        services,
        setServices
        }}>
      {children}
    </FormContext.Provider>
  );
};