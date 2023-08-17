import '@/styles/globals.css'
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import '@fortawesome/fontawesome-svg-core/styles.css';
import type { AppProps } from 'next/app'
import Layout from './layouts/index';
import { MenuProvider } from '@/context/MenuContext';
import { FormProvider } from '@/context/FormContext';
import { SearchServiceProvider } from '@/context/SearchServiceContext';
import { io } from 'socket.io-client';
import {useEffect, useState} from 'react';
import { Auth } from '@/hooks/auth';
import ErrorPage from './404';

export default function App({ Component, pageProps }: AppProps) {
  const { getUserAuthenticated } = Auth();

  const [userToken, setUserToken] = useState<string>('');

  // const socket = io('https://boatmate.com', {
  //   auth: {token: userToken},
  // });

  const getToken = async () => {
    try {
      const response = await getUserAuthenticated();
      if(response.status == 200) {
        setUserToken(response.data.tokenUser);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getToken();
    if(userToken != '') {
      const socket = io('https://boatmate.com', {
        auth: {token: userToken},
      });
      
      socket.on('connect', () => {
        console.log('socket connected')
      });
      socket.on('test', (data) => {
          console.log(data)
      })
      socket.on('connect_error', (err) => {
          console.log('connect error: ', err)
      })
      socket.on('contract-create', (data) => {
          console.log('contract-info: ', data)
      })
    }
  }, [userToken])

  return (
    <>
      <ErrorPage />
      <SearchServiceProvider>
        <FormProvider>
          <MenuProvider>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </MenuProvider>
        </FormProvider>
      </SearchServiceProvider>
    </>
  )
}
