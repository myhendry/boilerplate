import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Web3ReactProvider } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import { SessionProvider } from "next-auth/react";
//import Web3 from "web3";

import { DemoContextProvider } from "../context/demo-context";

function getLibrary(provider: any) {
  return new Web3Provider(provider);
}

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <Web3ReactProvider getLibrary={getLibrary}>
        <DemoContextProvider>
          <Component {...pageProps} />
        </DemoContextProvider>
      </Web3ReactProvider>
    </SessionProvider>
  );
}

export default MyApp;
