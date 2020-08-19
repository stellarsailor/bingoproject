import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import styled from 'styled-components'
import { Row, Col, BackTop } from 'antd';
import { IntlProvider, FormattedMessage, FormattedNumber, useIntl } from 'react-intl'
import locale from '../../locale/translations'


import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function list(props) {
    const router = useRouter()
    const { bingoId } = router.query
    let langSetting = 'ko'

    return(
        <IntlProvider defaultLocale="en" locale={langSetting} messages={locale[langSetting]} onError={(e) => console.log(e)}>
            <Navbar />
                <div style={{width: '100%', height: 'auto', backgroundImage: `url('/images/official-silhouette-background.jpg')`,
                backgroundRepeat: 'no-repeat', backgroundAttachment: 'fixed'}}>
                    {bingoId}
                </div>
            <Footer />
        </IntlProvider>
    )
}