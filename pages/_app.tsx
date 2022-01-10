import "../styles/globals.css";
import type { AppProps } from "next/app";
import { DemoContextProvider } from "../context/demo-context";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <DemoContextProvider>
      <Component {...pageProps} />
    </DemoContextProvider>
  );
}

export default MyApp;
