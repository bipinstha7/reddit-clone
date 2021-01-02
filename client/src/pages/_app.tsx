import { AppProps } from "next/app";
import React from "react";
import { useRouter } from "next/router";
import { SWRConfig } from "swr";

import "../styles/tailwind.css";
import Navbar from "components/navbar";
import { AuthProvider } from "context/auth";
import useApi from "api/index";

function App({ Component, pageProps }: AppProps) {
  const { API } = useApi();
  const { pathname } = useRouter();
  const authRoutes = ["/register", "/login"];
  const authRoute = authRoutes.includes(pathname);

  return (
    <SWRConfig
      value={{
        fetcher: url =>
          API.get(url)
            .then((res: any) => res.data)
            .catch(err => err.response.data),
        dedupingInterval: 10000,
      }}
    >
      <AuthProvider>
        {!authRoute ? <Navbar /> : null}
        <div className={authRoute ? "" : "pt-12"}>
          <Component {...pageProps} />
        </div>
      </AuthProvider>
    </SWRConfig>
  );
}

export default App;
