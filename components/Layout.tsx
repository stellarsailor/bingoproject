import styled from 'styled-components'
import Navbar from './Navbar'
import Footer from './Footer'
import Header from './Header'

export default function Layout(props) {

    return(
        <div>
            <Header />
            <Navbar />
            {props.children}
            <Footer />
        </div>
    )
}