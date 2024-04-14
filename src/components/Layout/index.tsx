import { AppProps } from "next/app";
import Head from "next/head";
import { FC } from "react";
import { ContextProvider } from "../../contexts/ContextProvider";
import { AppBar } from "../AppBar";
import { ContentContainer } from "../ContentContainer";
import { Footer } from "../Footer";
import Notifications from "../Notification";

export default function Layout({ children }) {
  return (
    <>
      <Head>
        <title>Solana Scaffold Lite</title>
      </Head>

      <ContextProvider>
        <div className="flex flex-col h-screen">
          <Notifications />
          <AppBar />
          <ContentContainer>
            {children}
            <Footer />
          </ContentContainer>
        </div>
      </ContextProvider>
    </>
  );
}
