import "../styles/globals.css";
import Header from "../layouts/Header/Header";
import Footer from "../layouts/Footer/Footer";
import { useRouter } from 'next/router';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'

function MyApp({ Component, pageProps }) {

  const router = useRouter();
  const showHeader = router.pathname !== '/' && router.pathname !== '/recovery';
  return (
    <div id="pantaBackground" style={{ background:'url(/images/background.jpg)', minHeight: '100vh' }}>
      {showHeader && <Header />}
      <Component {...pageProps} />
      <Footer/>
    </div>
  );
}

export default MyApp;
