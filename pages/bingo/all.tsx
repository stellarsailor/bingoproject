import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import styled from 'styled-components'
import { Row, Col, BackTop } from 'antd';
import { IntlProvider, FormattedMessage, FormattedNumber, useIntl } from 'react-intl'
import locale from '../../locale/translations'


import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function list(props) {
    let langSetting = 'ko'

    return(
        <IntlProvider defaultLocale="en" locale={langSetting} messages={locale[langSetting]} onError={(e) => console.log(e)}>
            <Navbar />
                여긴 리스트 쭉 보여주고
                검색 가능하고
            <Footer />
        </IntlProvider>
    )
}