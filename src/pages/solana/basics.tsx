import type { NextPage } from "next";
import Head from "next/head";
import { BasicsView } from "../../views";
import Layout from "../../components/Layout";

const Basics = (props) => {
  return (
    <div>
      <Head>
        <title>Solana Scaffold</title>
        <meta name="description" content="Basic Functionality" />
      </Head>
      <BasicsView />
    </div>
  );
};

export default Basics;

Basics.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
