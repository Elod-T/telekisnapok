import TurnstileComponent from "@components/turnstile";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import { useEffect, useState } from "react";
import "../styles/tailwind.css";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  const [verified, setVerified] = useState(true);
  useEffect(() => {
    const verify = sessionStorage.getItem("verified");

    setVerified(verify === "true");
  }, []);

  function handleVerification() {
    sessionStorage.setItem("verified", "true");
    setVerified(true);
  }

  function handleError() {
    sessionStorage.setItem("verified", "false");
    setVerified(false);
    alert("Hiba történt a böngésző ellenőrzésekor!");
  }

  if (!verified) {
    return (
      <TurnstileComponent onVerify={handleVerification} onFail={handleError} />
    );
  }

  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}
