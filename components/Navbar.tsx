// import Link from 'next/link'
import styled from 'styled-components'
import { Input, Row, Col, Popover, Button, message, Modal, Dropdown, Menu } from 'antd';
import { Link, useTranslation, Router } from '../i18n'
import { MenuOutlined, SearchOutlined, ExclamationCircleOutlined, DownOutlined, BehanceOutlined } from '@ant-design/icons';
import { useEffect, useState, useCallback, useContext } from 'react';
import { InitialContents } from '../store/InitialContentsProvider';
import { CenteredRow } from './sub/styled';
import langCodeToLanguage from '../logics/langCodeToLanguage'
import useIsMobile from '../logics/useIsMobile';

const { Search } = Input
message.config({
    top: 58,
})
const { confirm } = Modal

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

const HamburgerMenuTab = styled.div`
    color: rgba(0, 0, 0, 0.85);
    margin: 5px 0px;
`

export default function NavBar({ }) {
    // const { formatMessage: tr } = useIntl();
    const { t, i18n } = useTranslation()
    const isMobile = useIsMobile()

    const [ visibleRight, setVisibleRight ] = useState(false)
    const [ supportedLanguages, setSupportedLanguages ] = useState(i18n.options.supportedLngs || [])

    const handleSearch = useCallback((searchParam) => {
        if(searchParam === ''){
            message.warning('Please type search keyword')
        } else {
            Router.push(`/bingo?search=${searchParam}`)
        }
    },[])

    const menu = (
        <Menu>
            {supportedLanguages.map((v, index) => {
                if(index !== supportedLanguages.length - 1)
                return (
                    <Menu.Item key={index} onClick={() => i18n.changeLanguage(v)} style={{padding: '8px 20px'}}>
                        {langCodeToLanguage(v)}
                    </Menu.Item>
                )
                })}
            {/* <Menu.Divider /> */}
        </Menu>
    )

    const contentOption = (
        <div style={{width: 180}}>
            <Link href="/bingo/create">
                <a>
                    <HamburgerMenuTab onClick={() => toggleOption()}>{t("CREATE_SELFBINGO")}</HamburgerMenuTab>
                </a>
            </Link>
            <Link href="/about">
                <a>
                    <HamburgerMenuTab onClick={() => toggleOption()}>{t("ETC_ABOUT")}</HamburgerMenuTab>
                </a>
            </Link>
            <Link href="/privacy">
                <a>
                    <HamburgerMenuTab onClick={() => toggleOption()}>{t("ETC_PRIVACY_POLICY")}</HamburgerMenuTab>
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
                <Col xs={23} sm={22} md={20} lg={20} xl={12} >
                    <CenterAlign>
                        <Link href="/"><a>
                            { isMobile ? null : <img src="/static/images/icon.png" alt="my image" style={{height: 35}} /> }
                            <img src="/static/images/logo.png" alt="my image" style={{height: isMobile ? 22 : 35}} />
                        </a></Link>
                        <Search
                        placeholder={t('SEARCH_INPUT_PLACEHOLER')}
                        onSearch={value => handleSearch(value)}
                        style={{ width: isMobile ? 150 : 250, height: isMobile ? 28 : 30 }}
                        />
                        <CenteredRow>
                            <Dropdown overlay={menu} placement="bottomRight" trigger={['click']}>
                                <BehanceOutlined style={{fontSize: '1.5rem', color: 'gray', marginRight: isMobile ? 8 : 16}} />
                            </Dropdown>
                            <Popover placement="bottomRight" content={contentOption} visible={visibleRight}>
                                <MenuOutlined style={{fontSize: '1.3rem', color: 'gray'}} onClick={() => toggleOption()} />
                            </Popover>
                        </CenteredRow>
                    </CenterAlign>
                </Col>
            </Row>
        </NavigationBar>
    )
}