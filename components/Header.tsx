import Head from 'next/head'

function Header(props) {
    
    const { title } = props

    return (
        <Head>
            <title>My page title</title>
            <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no" />
            <script src="https://www.google-analytics.com/analytics.js" async type="text/javascript"></script>
            <link rel="shortcut icon" href="/static/favicon.ico" />
        </Head>
    )
}

export default Header