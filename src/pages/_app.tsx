import { type AppType } from 'next/app';
import { api } from '~/utils/api';
import '~/styles/globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import Layout from '~/components/Layout';
import Modal from 'react-modal';
const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ClerkProvider {...pageProps}>
      <Layout {...pageProps}>
        <Component {...pageProps} />
      </Layout>
    </ClerkProvider>
  );
};

Modal.setAppElement('#__next');

export default api.withTRPC(MyApp);
