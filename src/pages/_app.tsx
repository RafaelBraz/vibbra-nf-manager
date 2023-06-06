import type { AppProps } from "next/app";
import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";
import { Inter } from "next/font/google";
import Auth from "@/components/Auth";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <title>NF Manager</title>
      </Head>

      <SessionProvider session={session}>
        <main className={`${inter.className} min-h-screen flex flex-col`}>
          <Auth>
            <Component {...pageProps} />
          </Auth>
        </main>
      </SessionProvider>
    </>
  );
}

export default MyApp;
