import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import Clarity from "../components/clarity";
import "../styles/tailwind.css";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
      <Clarity />
    </SessionProvider>
  );
}
