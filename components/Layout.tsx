import styled from 'styled-components'
import Navbar from './Navbar'
import Footer from './Footer'
import Header from './Header'
import { Row, Col } from 'antd'

export default function Layout(props) {

    return(
        <>
            <Header />
            <Navbar />
            <Row type="flex" justify="center" style={{marginTop: 50, backgroundColor: 'var(--mono-1)', minHeight: '100vh'}}>
                <Col xs={24} sm={22} md={20} lg={20} xl={12} >
                    {props.children}
                </Col>
            </Row>
            {/* <Footer /> */}
        </>
    )
}