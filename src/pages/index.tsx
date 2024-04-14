import type { NextPage } from "next";
import Head from "next/head";
import { HomeView } from "../views";
import Link from "next/link";

const Home: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>web3 test demo</title>
      </Head>

      <div className="flex items-center justify-center h-screen">
        <Link href="/eth">
          <button className="px-8 m-2 btn animate-pulse bg-gradient-to-br from-indigo-500 to-fuchsia-500 hover:from-white hover:to-red-400 text-black">
            <span>eth demo</span>
          </button>
        </Link>
        <Link href="/solana">
          <button className="px-8 m-2 btn animate-pulse bg-gradient-to-br from-indigo-500 to-fuchsia-500 hover:from-white hover:to-purple-300 text-black">
            <span>solana demo </span>
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
