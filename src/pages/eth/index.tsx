import type { NextPage } from "next";
import Head from "next/head";
import { HomeView } from "../../views";

const Home: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>eth demo</title>
        <meta name="description" content="eth demo" />
      </Head>
      welcome eth demo
    </div>
  );
};

export default Home;
