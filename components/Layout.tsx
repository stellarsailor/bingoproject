import Navbar from './Navbar'
import { Row, Col } from 'antd'
import Head from 'next/head'

export default function Layout(props) {

    return(
        <div>
            <Head>
                <title>SelfBingo</title>
                <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no" />

                <link rel="shortcut icon" href="/static/favicon.ico" />
            </Head>
            <Navbar />
            <Row justify="center" style={{backgroundColor: 'var(--mono-1)', minHeight: '100vh'}}>
                <Col xs={24} sm={22} md={20} lg={20} xl={12} >
                    {props.children}
                </Col>
            </Row>
        </div>
    )
}