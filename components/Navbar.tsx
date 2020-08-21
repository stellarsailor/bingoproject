// import Link from 'next/link'
import styled from 'styled-components'
import { useIntl } from 'react-intl';
import { Input } from 'antd';
import { i18n, Link, useTranslation } from '../i18n'

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

export default function NavBar({ }) {
    // const { formatMessage: tr } = useIntl();
    const { t, i18n } = useTranslation();

    return(
        <NavigationBar>
            <Link href="/"><a><div>마크랑 타이틀</div></a></Link>
            <Link href="/bingo"><a>{t('NAV_BUTTON_1')}</a></Link>
            <Link href="/bingo/create"><a>{t('NAV_BUTTON_2')}</a></Link>
            <Search
            placeholder={t('SEARCH_INPUT_PLACEHOLER')}
            onSearch={value => console.log(value)}
            style={{ width: 200 }}
            />
            <button
            type='button'
            onClick={() => i18n.changeLanguage(i18n.language === 'en' ? 'ko' : 'en')}
            >
            {t('change-locale')}
            </button>
        </NavigationBar>
    )
}