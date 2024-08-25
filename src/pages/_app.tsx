import { ReactNode, ReactElement, useEffect } from "react";
import type { AppProps, AppContext } from "next/app";
import { trpc } from "@/shared/api";
import { SessionProvider, getSession, useSession } from "next-auth/react";
import { useRouter } from "next/router";

import "@/app/global.css";
import { NextPage } from "next";

type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function Auth({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const isUser = !!session?.user;
  const loading = status === "loading";

  useEffect(() => {
    if (!loading && !isUser && router.pathname !== "/api/auth/signin") {
      router.push("/api/auth/signin");
    }
  }, [isUser, loading, router]);

  if (loading) {
    return <div>Загрузка...</div>;
  }

  return <>{children}</>;
}

function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout || ((page: ReactNode) => page);

  return (
    <div className="mx-auto max-w-4xl">
      <SessionProvider session={pageProps.session}>
        <Auth>
          {getLayout(<Component {...pageProps} />)}
        </Auth>
      </SessionProvider>
    </div>
  );
}

App.getInitialProps = async (ctx: AppContext) => {
  return {
    pageProps: {
      session: await getSession(ctx.ctx),
    },
  };
};

export default trpc.withTRPC(App);