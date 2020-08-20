import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import styled from 'styled-components'
import { Row, Col, BackTop } from 'antd';
import { IntlProvider, FormattedMessage, FormattedNumber, useIntl } from 'react-intl'
import locale from '../../locale/translations'


import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Layout from '../../components/Layout';
import { serverUrl } from '../../lib/serverUrl';

export default function list({ data }) {
    // const router = useRouter()
    // const { bingoId } = router.query

    const [ sample, setSample ] = useState(data.bingo)

    return(
        <Layout>
            {sample.title}
            사이즈 : {sample.size} x {sample.size}
        </Layout>
    )
}

export async function getServerSideProps({ params }) {

    const res = await fetch(`${serverUrl}/api/bingos/${params.bingoId}`)
    const data = await res.json()

    return { props: { data } }
}