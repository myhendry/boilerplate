import React, { useEffect, useState } from "react";
import { BigNumber } from "@ethersproject/bignumber";
import { formatEther } from "@ethersproject/units";
import { useWeb3React, UnsupportedChainIdError } from "@web3-react/core";
import {
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected,
} from "@web3-react/injected-connector";
import {
  URI_AVAILABLE,
  UserRejectedRequestError as UserRejectedRequestErrorWalletConnect,
} from "@web3-react/walletconnect-connector";
import { UserRejectedRequestError as UserRejectedRequestErrorFrame } from "@web3-react/frame-connector";

import { injected } from "../../lib/wallet";
import { ethers } from "ethers";
import { Web3Provider } from "@ethersproject/providers";

interface Props {}

interface INetwork {
  [key: number]: string;
}

const NETWORKS: INetwork = {
  1: "Ethereum Main Network",
  3: "Ropsten Test Network",
  4: "Rinkeby Test Network",
  5: "Goerli Test Network",
  42: "Kovan Test Network",
  56: "Binance Smart Chain",
  1337: "Ganache",
};

const Web3React = (props: Props) => {
  const {
    active,
    account,
    library,
    connector,
    activate,
    deactivate,
    chainId,
    error,
  } = useWeb3React();
  const [balance, setBalance] = useState<BigNumber | undefined>();
  const [network, setNetwork] = useState<string>("");

  console.log("error", error);

  useEffect(() => {
    const getBalance = async () => {
      if (account) {
        const balance = await library.getBalance(account);
        setBalance(balance);
      }
    };
    getBalance();
  }, [account, library]);

  useEffect(() => {
    const getNetwork = async () => {
      const network = (!!(chainId && account) && NETWORKS[chainId]) || "";
      setNetwork(network);
    };
    getNetwork();
  }, [chainId, account]);

  const connect = async () => {
    try {
      await activate(injected);
    } catch (error) {
      const errMsg = getErrorMessage(error);
      console.log("err", errMsg);
    }
  };

  const disconnect = async () => {
    try {
      await deactivate();
    } catch (error) {
      const errMsg = getErrorMessage(error);
      console.log("err", errMsg);
    }
  };

  const signIn = async () => {
    const message = `Logging in at ${new Date().toISOString()}`;
    try {
      const signature = await library.getSigner(account).signMessage(message);
      console.log("signature", signature);
    } catch (error) {
      const errMsg = getErrorMessage(error);
      console.log("err", errMsg);
    }
  };

  const getErrorMessage = (error: any): string => {
    if (error instanceof NoEthereumProviderError) {
      return "No Ethereum browser extension detected, install MetaMask on desktop or visit from a dApp browser on mobile.";
    } else if (error instanceof UnsupportedChainIdError) {
      return "You're connected to an unsupported network.";
    } else if (
      error instanceof UserRejectedRequestErrorInjected ||
      error instanceof UserRejectedRequestErrorWalletConnect ||
      error instanceof UserRejectedRequestErrorFrame
    ) {
      return "Please authorize this website to access your Ethereum account.";
    } else {
      console.error(error);
      return "An unknown error occurred. Check the console for more details.";
    }
  };

  return (
    <div>
      <h1>Web3-React</h1>
      {active ? (
        <div>
          <span>
            Connected with <b>{account}</b>
          </span>
          <p>Network: {network}</p>
          <button
            onClick={disconnect}
            className="btn btn-warning rounded-md block w-1/4"
          >
            Disconnect
          </button>
          <div>
            <strong>{balance ? `${formatEther(balance)} ETH` : null}</strong>
          </div>
          <button
            onClick={signIn}
            className="btn btn-accent rounded-md block w-1/4"
          >
            Sign
          </button>
        </div>
      ) : (
        <div>
          <span>Not Connected</span>
          <button
            onClick={connect}
            className="btn btn-primary rounded-md block w-1/4"
          >
            Connect to Wallet
          </button>
        </div>
      )}
    </div>
  );
};

export default Web3React;
