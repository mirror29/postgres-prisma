import Head from "next/head";
import { HomeView } from "../../views";
import Layout from "../../components/Layout";

export default function Home() {
  return (
    <div>
      <Head>
        <title>Solana Scaffold</title>
        <meta name="description" content="Solana Scaffold" />
      </Head>
      <HomeView />
    </div>
  );
}

Home.getLayout = function getLayout(page) {
  return (
    <Layout>
      {page}
    </Layout>
  );
};
