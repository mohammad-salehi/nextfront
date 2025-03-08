import "../styles/globals.css";
import Header from "../components/Header/Header";
import { useRouter } from 'next/router';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'

function MyApp({ Component, pageProps }) {

  const router = useRouter();
  const showHeader = router.pathname !== '/';
  return (
    <>
      {showHeader && <Header />}
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
