import Link from 'next/link'
import styled from 'styled-components'
import { useIntl } from 'react-intl';
import { Input } from 'antd';

const { Search } = Input;

const NavigationBar = styled.div`
    padding: 0px 20%;
    height: 60px;
    position: sticky;
    top: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    max-width: 100%;
    background-color: rgba(255,255,255, 0.9);
    z-index: 101;
`

export default function Navbar() {
    const { formatMessage: tr } = useIntl();

    return(
        <NavigationBar>
            <Link href="/"><a><div>마크랑 타이틀</div></a></Link>
            <Link href="/bingo"><a>{tr({id: 'NAV_BUTTON_1'})}</a></Link>
            <Link href="/bingo/create"><a>{tr({id: 'NAV_BUTTON_2'})}</a></Link>
            <Search
            placeholder={tr({id: 'SEARCH_INPUT_PLACEHOLER'})}
            onSearch={value => console.log(value)}
            style={{ width: 200 }}
            />
            언어 설정
        </NavigationBar>
    )
}
