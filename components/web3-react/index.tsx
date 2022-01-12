import React, { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { BigNumber } from "@ethersproject/bignumber";
import { formatEther } from "@ethersproject/units";

import { injected } from "../../lib/wallet";

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
      console.log(error);
    }
  };

  const disconnect = async () => {
    try {
      await deactivate();
    } catch (error) {
      console.log(error);
    }
  };

  const signIn = async () => {
    const message = `Logging in at ${new Date().toISOString()}`;
    try {
      const signature = await library.getSigner(account).signMessage(message);
      console.log("signature", signature);
    } catch (error) {
      console.log(error);
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
