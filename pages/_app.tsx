import App from "next/app";
import type { AppProps /*, AppContext */ } from 'next/app'
import '../styles/style.css'
import locale from '../locale/translations'
import { useEffect } from 'react'
import Head from 'next/head'
import { appWithTranslation } from '../i18n'
import Layout from "../components/Layout";

function MyApp({ Component, pageProps }: AppProps) {
//   useEffect(() => {
//     console.log('titmgig' + Math.random())
//   },[])

    return (
        <Layout>
            <Component {...pageProps} />
        </Layout>
    )
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
    const appProps = await App.getInitialProps(appContext)
    const defaultProps = appContext.Component.defaultProps
    return {
        ...appProps,
        pageProps: {
            namespacesRequired: [...(appProps.pageProps.namespacesRequired || []), ...(defaultProps?.i18nNamespaces || [])]
        }
    }
}

export default appWithTranslation(MyApp)