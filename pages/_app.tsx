// import App from "next/app";
import type { AppProps /*, AppContext */ } from 'next/app'
import { IntlProvider, FormattedMessage, FormattedNumber, useIntl } from 'react-intl'
import '../styles/style.css'
import locale from '../locale/translations'
import { useEffect } from 'react'
import Head from 'next/head'

function MyApp({ Component, pageProps }: AppProps) {
  let langSetting = 'en'
  useEffect(() => {
    console.log('titmgig' + Math.random())
  },[])

  return (
    <>
      <Head>
        <script src="https://www.google-analytics.com/analytics.js" async type="text/javascript"></script>
      </Head>
    <IntlProvider defaultLocale="en" locale={langSetting} messages={locale[langSetting]} onError={(e) => console.log(e)}>
      <Component {...pageProps} />
    </IntlProvider>
    </>
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

export default MyApp