import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import styled from 'styled-components'
import { Row, Col, BackTop, Input, Checkbox, Radio } from 'antd';

import { serverUrl } from '../../lib/serverUrl'
import { useTranslation } from '../../i18n';

export default function BingoCreate({ data, query, params }) {
    const { t, i18n } = useTranslation();

    const [ bingoSize, setBingoSize ] = useState(3)

    const renderBingo = (size) => {
        let arr = []
        for(let i = 0; i < size*size; i++){
            arr.push(i)
        }

        return <div>
            {arr.map( (v, index) => <span key={v}>{v}</span>)}
        </div>
    }

    return(
        <>
            현재 언어 : {i18n.language}
            <div>
                생성하는 페이지{t('SEARCH_INPUT_PLACEHOLER')}
            </div>
            제목
            <Input placeholder="Title" />
            설명
            <Input placeholder="Description" />
            <Checkbox onChange={e => console.log(e)}>NSFW</Checkbox>
            비밀번호
            <Input.Password placeholder="input password" />
            공개 일부공개 설정
            <Radio.Group defaultValue="a">
                <Radio.Button value="a">공개</Radio.Button>
                <Radio.Button value="b">일부공개</Radio.Button>
            </Radio.Group>

            Bingo Size
            <Radio.Group defaultValue="3" onChange={(e) => setBingoSize(e.target.value)}>
                <Radio.Button value="3">3</Radio.Button>
                <Radio.Button value="5">5</Radio.Button>
                <Radio.Button value="7">7</Radio.Button>
                <Radio.Button value="9">9</Radio.Button>
            </Radio.Group>

            {renderBingo(bingoSize)}
        </>
    )
}