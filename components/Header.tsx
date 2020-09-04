import Head from 'next/head'

function Header(props) {
    
    const { title } = props

    return (
        <Head>
            <script async src="https://www.googletagmanager.com/gtag/js?id=UA-154973389-2" />
            <script
                dangerouslySetInnerHTML={{
                __html: `
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                        gtag('config', 'UA-154973389-2');
                    `,
                }}
            />

            <title>My page title</title>
            <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no" />

            <link rel="shortcut icon" href="/static/favicon.ico" />
        </Head>
    )
}

export default Header