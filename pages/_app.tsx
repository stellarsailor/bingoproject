import App from "next/app";
import type { AppProps /*, AppContext */ } from "next/app";
import "../styles/style.css";

import { Provider } from "next-auth/client";
import { providers, signIn } from "next-auth/client";

import { appWithTranslation } from "../i18n";
import { DefaultSeo } from "next-seo";

import InitialContentsProvider from "../store/InitialContentsProvider";
import Layout from "../components/Layout";

import Router from "next/router";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());
NProgress.configure({ showSpinner: false });

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider session={pageProps.session}>
      <InitialContentsProvider>
        <DefaultSeo
          title="SelfBingo"
          canonical="https://www.selfbingo.com/"
          openGraph={{
            type: "website",
            locale: "en_IE",
            url: "https://www.selfbingo.com/",
            site_name: "SelfBingo",
          }}
          twitter={{
            handle: "@handle",
            site: "@site",
            cardType: "summary_large_image",
          }}
        />
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </InitialContentsProvider>
    </Provider>
  );
}

// Only uncomment this method if you have blocking data requirements for
// every single page in your application. This disables the ability to
// perform automatic static optimization, causing every page in your app to
// be server-side rendered.
//
// MyApp.getInitialProps = async (appContext: AppContext) => {
//   // calls page's `getInitialProps` and fills `appProps.pageProps`
//   const appProps = await App.getInitialProps(appContext);

//   return { ...appProps }
// }

// MyApp.getInitialProps = async (appContext) => ({ ...await App.getInitialProps(appContext) }) //i18n 파트

MyApp.getInitialProps = async (appContext) => {
  const appProps = await App.getInitialProps(appContext);
  const defaultProps = appContext.Component.defaultProps;
  return {
    ...appProps,
    pageProps: {
      namespacesRequired: [
        ...(appProps.pageProps.namespacesRequired || []),
        ...(defaultProps?.i18nNamespaces || []),
      ],
      // providers: await providers(appContext)
    },
  };
};

export default appWithTranslation(MyApp);
