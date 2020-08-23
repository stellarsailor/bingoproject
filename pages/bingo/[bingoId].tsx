import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/router'
import styled from 'styled-components'
import { Row, Col, BackTop } from 'antd';
import { Link, useTranslation } from '../../i18n';

import { serverUrl } from '../../lib/serverUrl';

export default function BingoDetail({ data }) {
    // const router = useRouter()
    // const { bingoId } = router.query
    const { t, i18n } = useTranslation();

    const [ sample, setSample ] = useState(data.bingo)

    useEffect(() => {
        // console.log('렌더링 순서')
    },[])

    return(
        <>
            <div>
                {sample.title}
            </div>
            <div>
                사이즈 : {sample.size} x {sample.size}

                렌더링
            </div>
            신고
            설정 - (체크 표시 모양 설정 / 배경색 / 줄색 설정 - 이걸 작성자입장으로 빼야될지?)
        </>
    )
}

export async function getServerSideProps({ params, req }) {
    console.log(req.language)

    let url = `${serverUrl}/api/bingos/${params.bingoId}`
    // console.log(url)

    const res = await fetch(url)
    const data = await res.json()

    return { props: { data } }
}