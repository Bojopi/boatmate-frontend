import '@/styles/globals.css'
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import type { AppProps } from 'next/app'
import Layout from './layouts/index';
import { MenuProvider } from '@/context/MenuContext';

export default function App({ Component, pageProps }: AppProps) {

  return (
    <>
      <MenuProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </MenuProvider>
    </>
  )
}
