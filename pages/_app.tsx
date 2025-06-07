import type { AppProps } from "next/app";
import { AbstraxionProvider } from "../lib/xion";
import "../styles/globals.css"
import Navbar from "../components/Navbar";
import ToastContainer from "../components/ToastContainer";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AbstraxionProvider
      config={{
        treasury: process.env.NEXT_PUBLIC_TREASURY_CONTRACT!,
        // Hapus 'network' dan 'apiKey' karena tidak valid
      }}
    >
      <Navbar />
      <ToastContainer />
      <main className="pt-16 py-8">
        <Component {...pageProps} />
      </main>
    </AbstraxionProvider>
  );
}

export default MyApp;
