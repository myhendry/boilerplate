import type { NextPage } from "next";
import Head from "next/head";
import React from "react";

import Form from "../components/form";
import { Header } from "../components/common";
import Greet from "../components/greet";
import Web3React from "../components/web3-react";
import { useDemoContext } from "../context/demo-context";
import Memory from "../components/memory";
import Fund from "../components/fund";
// import Image from "next/image";

const Home: NextPage = () => {
  const { todos, saveTodo } = useDemoContext();
  console.log(todos, saveTodo);

  return (
    <>
      <Head>
        <title>NFT Game</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      <div className="m-5">
        <h1 className="text-3xl font-bold">NFT Game</h1>
        <Web3React />
        <Memory />
        <Greet />
        <Fund />
        {/* <Form  /> */}
      </div>
    </>
  );
};

export default Home;
