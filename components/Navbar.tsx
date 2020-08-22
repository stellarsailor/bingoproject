// import Link from 'next/link'
import styled from 'styled-components'
import { useIntl } from 'react-intl';
import { Input, Row, Col, Popover, Button } from 'antd';
import { i18n, Link, useTranslation, Router } from '../i18n'
import { MenuOutlined, SearchOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';

const { Search } = Input;

const NavigationBar = styled.div`
    width: 100%;
    position: fixed;
    top: 0;
    /* display: flex; */
    /* justify-content: space-between; */
    /* align-items: center; */
    /* max-width: 100%; */
    border-bottom: 1px solid #f5f5f5;
    background-color: rgba(255,255,255, 0.98);
    z-index: 101;
`

const NavigationButton = styled.span`
    color: var(--mono-5);
`

const CenterAlign = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`

export default function NavBar({ }) {
    // const { formatMessage: tr } = useIntl();
    const { t, i18n } = useTranslation();

    // const [ isMobile, setIsMobile ] = useState(false)

    // useEffect(() => {
    //     if(window.innerWidth < 600) setIsMobile(true)
    // },[])

    const contentSearch = (
        <div style={{width: 200}}>
            <Search
            placeholder={t('SEARCH_INPUT_PLACEHOLER')}
            onSearch={value => Router.push(`/bingo?search=${value}`)}
            style={{ width: '100%' }}
            />
        </div>
    )

    const contentOption = (
    <div style={{width: 200}}>
        <Link href="/bingo/create">
            <a>ㅂㄱ 만들기</a>
        </Link>
        <Link href="/setting">
            <a>설정</a>
        </Link>
        <div onClick={() => i18n.changeLanguage(i18n.language === 'en' ? 'ko' : 'en')}>언어 변경</div>
    </div>
    )


    return(
        <NavigationBar>
            <Row type="flex" justify="center" style={{height: 50, display: 'flex', alignItems: 'center'}}>
                <Col xs={0} sm={22} md={20} lg={20} xl={12} >
                    <CenterAlign>
                        <Link href="/"><a><img src="/static/images/icon.png" alt="my image" style={{height: 35}} /><img src="/static/images/logo.png" alt="my image" style={{height: 35}} /></a></Link>
                        <Search
                        placeholder={t('SEARCH_INPUT_PLACEHOLER')}
                        onSearch={value => Router.push(`/bingo?search=${value}`)}
                        style={{ width: 250 }}
                        />
                        <Popover placement="bottomRight" content={contentOption} trigger="click">
                            <MenuOutlined style={{fontSize: '2em', color: 'gray'}} />
                        </Popover>
                    </CenterAlign>
                </Col>
                <Col xs={24} sm={0} md={0} lg={0} xl={0} >
                    <CenterAlign>
                        <Popover placement="bottomRight" content={contentSearch} trigger="click">
                            <SearchOutlined style={{fontSize: '2rem'}} />
                        </Popover>
                        <Link href="/"><a><img src="/static/images/logo.png" alt="my image" style={{height: 25}} /></a></Link>
                        {/* <Link href="/bingo"><a><NavigationButton>{t('NAV_BUTTON_1')}</NavigationButton></a></Link> */}
                        {/* <Search
                        placeholder={t('SEARCH_INPUT_PLACEHOLER')}
                        onSearch={value => console.log(value)}
                        style={{ width: 200 }}
                        /> */}
                        <Popover placement="bottomRight" content={contentOption} trigger="click">
                            <MenuOutlined style={{fontSize: '2em', color: 'gray'}} />
                        </Popover>
                    </CenterAlign>
                </Col>
            </Row>
        </NavigationBar>
    )
}