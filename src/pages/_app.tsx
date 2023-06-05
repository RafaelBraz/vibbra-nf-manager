import type { AppProps } from "next/app";
import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";
import { Inter } from "next/font/google";
import Auth from "@/components/Auth";

const inter = Inter({ subsets: ["latin"] });

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <main
        className={`${inter.className} min-h-screen flex flex-col items-center p-24`}
      >
        <Auth>
          <Component {...pageProps} />
        </Auth>
      </main>
    </SessionProvider>
  );
}

export default MyApp;
