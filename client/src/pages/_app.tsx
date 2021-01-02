import { AppProps } from "next/app";
import React from "react";
import { useRouter } from "next/router";

import "../styles/tailwind.css";
import Navbar from "components/navbar";
import { AuthProvider } from "context/auth";

function App({ Component, pageProps }: AppProps) {
  const { pathname } = useRouter();
  const authRoutes = ["/register", "/login"];
  const authRoute = authRoutes.includes(pathname);

  return (
    <AuthProvider>
      {!authRoute ? <Navbar /> : null}
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default App;
