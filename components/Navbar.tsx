import Link from 'next/link'
import styled from 'styled-components'
import { Layout, Menu, Breadcrumb } from 'antd';
import { useIntl } from 'react-intl';

const NavigationBar = styled.div`
    background-color: black;
    height: 60;
    color: white;
    padding: 1rem;
`


export default function Navbar() {
    const { formatMessage: tr } = useIntl();

    return(
        <NavigationBar>
            <Link href="/"><a>{tr({id: 'TUTORIAL_1'})}</a></Link>
            <Link href="/bingo/all"><a>Bingo List</a></Link>
            언어 설정
        </NavigationBar>
    )
}