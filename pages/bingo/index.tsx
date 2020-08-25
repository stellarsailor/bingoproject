import React, { useState, useEffect, useCallback } from 'react'
import styled from 'styled-components'
import { Row, Col, BackTop, Radio } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons'

import { serverUrl } from '../../lib/serverUrl'
import { Link, useTranslation } from '../../i18n';

export default function List({ data }) {
    const { t, i18n } = useTranslation();

    const [ bingoList, setBingoList ] = useState(data.bingos)

    return(
        <>
            <Radio.Group defaultValue="a">
                <Radio.Button value="a">인기도 순</Radio.Button>
                <Radio.Button value="b">최신 순</Radio.Button>
            </Radio.Group>

            <Radio.Group defaultValue="a">
                <Radio.Button value="a">전체</Radio.Button>
                <Radio.Button value="b">이번달</Radio.Button>
                <Radio.Button value="c">이번주</Radio.Button>
                <Radio.Button value="d">오늘</Radio.Button>
            </Radio.Group>

            <div>
                여긴 검색 한 뒤에 나오는 리스트 정리 / 
                좌측엔 제목만 검색, 제목+요소까지 포함하여 검색, 작성자 검색, 빙고 사이즈 설정 등 필터링 제공
                언어 무관 선택 옵션 넣기
                {t('SEARCH_INPUT_PLACEHOLER')}
                {bingoList.map(v => {
                    return (
                        <div key={v.id}>
                            <Link href={`/bingo/${v.id}`}><a>{v.title} / {v.size} {v.author}</a></Link>
                            <ArrowUpOutlined />
                            <ArrowDownOutlined />
                        </div>
                    )
                })}
            </div>
        </>
    )
}

export async function getServerSideProps({ req }) {
    console.log(req.language)

    // const protocol = req ? `${req.headers['x-forwarded-proto']}:` : location.protocol
    // const host = req ? req.headers['x-forwarded-host'] : location.host

    const res = await fetch(`${serverUrl}/api/bingos`)
    const data = await res.json()
  
    return { props: { data } }
}