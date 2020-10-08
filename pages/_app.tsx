import App from "next/app";
import type { AppProps /*, AppContext */ } from 'next/app'
import '../styles/style.css'
import { appWithTranslation } from '../i18n'

import Router from 'next/router';
import NProgress from 'nprogress'; 
import 'nprogress/nprogress.css'; 

import InitialContentsProvider from '../store/InitialContentsProvider'
import Layout from "../components/Layout";

Router.events.on('routeChangeStart', () => NProgress.start())
Router.events.on('routeChangeComplete', () => NProgress.done())
Router.events.on('routeChangeError', () => NProgress.done())
NProgress.configure({ showSpinner: false })

function MyApp({ Component, pageProps }: AppProps) {
    // useEffect(() => {
        //최초 렌더링시 오직 한번만 실행됨 여기서 최초 데이터 전부 한번 불러오고 context api에 저장하는거 고려해보기. 페이지 이동 시 메인이 계속 렌더링됨
    // },[])

    return (
        <InitialContentsProvider>
            <Layout>
                <Component {...pageProps} />
            </Layout>
        </InitialContentsProvider>
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