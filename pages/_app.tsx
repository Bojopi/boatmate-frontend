import '@/styles/globals.css'
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router';
import Layout from './layouts/index';

export default function App({ Component, pageProps }: AppProps) {

  return (
    <>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  )
}
