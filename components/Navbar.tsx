// import Link from 'next/link'
import styled from 'styled-components'
import { useIntl } from 'react-intl';
import { Input, Row, Col, Popover, Button, message } from 'antd';
import { i18n, Link, useTranslation, Router } from '../i18n'
import { MenuOutlined, SearchOutlined } from '@ant-design/icons';
import { useEffect, useState, useCallback } from 'react';

const { Search } = Input;
message.config({
    top: 58,
  });

const NavigationBar = styled.div`
    width: 100%;
    position: fixed;
    top: 0;
    /* display: flex; */
    /* justify-content: space-between; */
    /* align-items: center; */
    /* max-width: 100%; */
    border-bottom: 1px solid lightgray;
    background-color: rgba(255,255,255, 1);
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

    const [ isMobile, setIsMobile ] = useState(false)
    const [ visibleRight, setVisibleRight ] = useState(false)

    useEffect(() => {
        if(window.innerWidth < 600) setIsMobile(true)
    },[])

    const handleSearch = useCallback((searchParam) => {
        if(searchParam === ''){
            message.warning('Please type search keyword')
        } else {
            Router.push(`/bingo?search=${searchParam}`)
        }
    },[])

    const contentOption = (
    <div style={{width: 200}}>
        {
            !isMobile ? null :
            <Search
            placeholder={t('SEARCH_INPUT_PLACEHOLER')}
            onSearch={value => handleSearch(value)}
            style={{ width: '100%' }}
            />
        }
        <Link href="/bingo/create">
            <a>
                <div onClick={() => toggleOption()}>빙고 만들기</div>
            </a>
        </Link>
        <Link href="/about">
            <a>
                <div onClick={() => toggleOption()}>소개</div>
            </a>
        </Link>
        <Link href="/privacy">
            <a>
                <div onClick={() => toggleOption()}>개인정보처리방침</div>
            </a>
        </Link>
        <Link href="/setting">
            <a>
                <div onClick={() => toggleOption()}>언어 설정</div>
            </a>
        </Link>
    </div>
    )

    const toggleOption = useCallback(() => {
        if(visibleRight) setVisibleRight(false)
        else setVisibleRight(true)
    },[visibleRight])

    return(
        <NavigationBar>
            <Row justify="center" style={{height: 50, display: 'flex', alignItems: 'center'}}>
                <Col xs={0} sm={22} md={20} lg={20} xl={12} >
                    <CenterAlign>
                        <Link href="/"><a><img src="/static/images/icon.png" alt="my image" style={{height: 35}} /><img src="/static/images/logo.png" alt="my image" style={{height: 35}} /></a></Link>
                        <Search
                        placeholder={t('SEARCH_INPUT_PLACEHOLER')}
                        onSearch={value => handleSearch(value)}
                        style={{ width: 250 }}
                        />
                        <Popover placement="bottomRight" content={contentOption} visible={visibleRight}>
                            <MenuOutlined style={{fontSize: '1.5rem', color: 'gray'}} onClick={() => toggleOption()} />
                        </Popover>
                    </CenterAlign>
                </Col>
                <Col xs={23} sm={0} md={0} lg={0} xl={0} >
                    <CenterAlign>
                        <Link href="/"><a><img src="/static/images/logo.png" alt="my image" style={{height: 25}} /></a></Link>
                        <Popover placement="bottomRight" content={contentOption} visible={visibleRight}>
                            <MenuOutlined style={{fontSize: '1.5rem', color: 'gray'}} onClick={() => toggleOption()}/>
                        </Popover>
                    </CenterAlign>
                </Col>
            </Row>
        </NavigationBar>
    )
}