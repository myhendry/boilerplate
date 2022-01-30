import React, { useEffect } from "react";
import { useSession, signIn, signOut, getProviders } from "next-auth/react";

import { Layout } from "../components/common";

type Props = {};

const Auth = (props: Props) => {
  const { data: session } = useSession();

  useEffect(() => {
    const setProviders = async () => {
      // console.log(await getProviders());
    };
    setProviders();
  }, []);

  if (session) {
    return (
      <Layout>
        <p>Auth</p>
        Signed in as {session?.user?.email} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </Layout>
    );
  }

  return (
    <Layout>
      <p>Auth</p>
      Not signed in <br />
      <button onClick={() => signIn()}>Sign in</button>
    </Layout>
  );
};

export default Auth;
