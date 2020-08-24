import React, { useState, useEffect, useCallback, useContext } from 'react'
import Link from 'next/link'
import styled from 'styled-components'
import { TwitterPicker, PhotoshopPicker, CompactPicker } from 'react-color';
import { Row, Col, BackTop, Input, Checkbox, Radio, Select, Modal, InputNumber, Button } from 'antd';
const { Option } = Select;

import { serverUrl } from '../../lib/serverUrl'
import { useTranslation } from '../../i18n';
import bingos from '../api/bingos';
import { InitialContents } from '../../store/InitialContentsProvider';

const CreatePage = styled.div`
    margin-top: 1rem;
    background: ${(props) => `-webkit-linear-gradient(${props.bgMainColor}, ${props.bgSubColor})` };
    width: 100%;
    padding: 1rem;
    border: 1px solid var(--mono-2);
`

export default function BingoCreate({ data, query, params }) {
    const { t, i18n } = useTranslation();
    const { categoryList } = useContext(InitialContents)

    const [ bingoSize, setBingoSize ] = useState(3)
    const [ bingoArr, setBingoArr ] = useState([])

    const [ modalOpened, setModalOpened ] = useState(false)
    const [ modalWillChangeInput, setModalWillChangeInput ] = useState('')
    const [ modalWillChangeIndex, setModalWillChangeIndex ] = useState(0)

    const [ bingoBgMainColor, setBingoBgMainColor ] = useState('#ffffff')
    const [ bingoBgSubColor, setBingoBgSubColor ] = useState('#0693E3')
    const [ bingoFontColor, setBingoFontColor ] = useState('#000000')
    const [ bingoLineColor, setBingoLineColor ] = useState('#000000')
    const [ bingoLinePixel, setBingoLinePixel ] = useState(3)
    const [ bingoCellColor, setBingoCellColor ] = useState('#ffffff')

    useEffect(() => {
        let elements = []

        for(let i = 0; i < bingoSize*bingoSize; i++){
            elements.push(i)
        }

        setBingoArr(elements)
    },[bingoSize])

    const renderTable = useCallback((size) => {
        let rows = []
        
        for(let i = 0; i < size; i++){
            rows.push(
                <tr key={i}>
                    {bingoArr.map((v, index) => {
                        if( size * i <= index && index < size * (i+1) ){
                            return (
                                <td key={index} style={{border: `${bingoLinePixel}px solid ${bingoLineColor}`, backgroundColor: `${bingoCellColor}`}} onClick={() => openIndexedModal(index)}>
                                    <div style={{width: 100, height: 100, display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center', color: `${bingoFontColor}`}}>
                                        {v}
                                    </div>
                                </td>
                            )
                        }
                    })}
                </tr>
            )
        }
        return rows
    },[bingoArr, bingoLineColor, bingoLinePixel, bingoCellColor, bingoFontColor])

    const changeElement = useCallback((value: string, index: number) => {
        let copiedArr = [...bingoArr]
        copiedArr[index] = value
        setBingoArr(copiedArr)
        setModalOpened(false)
    },[bingoArr])

    const openIndexedModal = useCallback((willChangeIndex) => {
        setModalWillChangeIndex(willChangeIndex)
        setModalWillChangeInput(bingoArr[willChangeIndex])
        setModalOpened(true)
    },[bingoArr])

    const handleSubmit = useCallback(() => {
        //fetch
    },[bingoBgMainColor, bingoFontColor, bingoLineColor, bingoLinePixel, bingoCellColor])

    return(
        <>
        <CreatePage bgMainColor={bingoBgMainColor} bgSubColor={bingoBgSubColor}>
            제목
            <Input placeholder="Title" />
            설명
            <Input placeholder="Description" />
            {/* <Checkbox onChange={e => console.log(e)}>NSFW</Checkbox> */}
            비밀번호
            <Input.Password placeholder="input password" />

            <Select placeholder="Category" style={{ width: 120 }} onChange={v => console.log(v)}>
                {categoryList.map((v, index) => <Option key={index} value={v.name_ko}>{v.name_ko}</Option>)}
            </Select>

            <Radio.Group defaultValue="a">
                <Radio.Button value="a">공개</Radio.Button>
                <Radio.Button value="b">일부공개</Radio.Button>
            </Radio.Group>

            Bingo Size
            <Radio.Group defaultValue="3" onChange={(e) => setBingoSize(e.target.value)}>
                <Radio.Button value="3">3</Radio.Button>
                <Radio.Button value="5">5</Radio.Button>
            </Radio.Group>

            <table style={{}}>
                <tbody>
                    {renderTable(bingoSize)}
                </tbody>
            </table>

            <Modal
            title="내용 변경"
            visible={modalOpened}
            onOk={() => changeElement(modalWillChangeInput, modalWillChangeIndex)}
            onCancel={() => setModalOpened(false)}
            >
                <Input value={modalWillChangeInput} onChange={e => setModalWillChangeInput(e.target.value)} />
            </Modal>

            배경색 설정
            <div>
                <TwitterPicker color={bingoBgMainColor} onChangeComplete={(v) => setBingoBgMainColor(v.hex)} />
            </div>
            선 색 설정
            <div>
                <TwitterPicker color={bingoLineColor} onChangeComplete={(v) => setBingoLineColor(v.hex)} />
            </div>
            선 두께 설정
            <div>
                <InputNumber min={1} max={5} defaultValue={3} onChange={(v: number) => setBingoLinePixel(v)} />
            </div>
            셀 배경색 설정
            <div>
                <TwitterPicker color={bingoCellColor} onChangeComplete={(v) => setBingoCellColor(v.hex)} />
            </div>
            글씨 색 설정
            <div>
                <TwitterPicker color={bingoFontColor} onChangeComplete={(v) => setBingoFontColor(v.hex)} />
            </div>

            <Button type="primary" onClick={handleSubmit}>Submit</Button>
        </CreatePage>
        </>
    )
}
