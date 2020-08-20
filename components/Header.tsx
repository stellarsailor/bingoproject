import Head from 'next/head'

function Header(props) {
    
    const { title } = props

    return (
        <Head>
            <title>My page title</title>
            <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no" />
        </Head>
    )
}

export default Header