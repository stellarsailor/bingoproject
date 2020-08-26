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
import { ArrowLeftOutlined, LeftOutlined } from '@ant-design/icons';
import BingoRenderer from '../../components/BingoRenderer';
import { CenteredCol } from '../../components/sub/styled';

const ControllerPage = styled.div`
    background-color: white;
    border: 1px solid lightgray;
`

export default function BingoCreate({ data, query, params }) {
    const { t, i18n } = useTranslation();
    const { categoryList } = useContext(InitialContents)

    const [ bingoTitle, setBingoTitle ] = useState('Enter BINGO Title')
    const [ bingoAuthor, setBingoAuthor ] = useState('')
    
    const [ bingoSize, setBingoSize ] = useState(3)
    const [ bingoArr, setBingoArr ] = useState([])

    const [ bingoBgMainColor, setBingoBgMainColor ] = useState('#ffffff')
    const [ bingoBgSubColor, setBingoBgSubColor ] = useState('#0693E3')
    const [ bingoFontColor, setBingoFontColor ] = useState('#000000')
    const [ bingoLineColor, setBingoLineColor ] = useState('#000000')
    const [ bingoLinePixel, setBingoLinePixel ] = useState(3)
    const [ bingoCellColor, setBingoCellColor ] = useState('#ffffff')

    const [ modalOpened, setModalOpened ] = useState(false)
    const [ modalWillChangeInput, setModalWillChangeInput ] = useState('')
    const [ modalWillChangeIndex, setModalWillChangeIndex ] = useState(0)

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
    },[])


    useEffect(() => {
        let elements = []

        for(let i = 0; i < bingoSize*bingoSize; i++){
            elements.push( i +' ')
        }

        setBingoArr(elements)
    },[bingoSize])

    const handleSubmit = useCallback(() => {
        //fetch
    },[bingoBgMainColor, bingoFontColor, bingoLineColor, bingoLinePixel, bingoCellColor])

    return(
        <>
            <Row style={{paddingTop: 50}}>
                <Col xs={24} sm={24} md={24} lg={24} xl={24} style={{marginTop: 8, marginBottom: 8}}>
                    <ControllerPage>
                        <div style={{width: '100%', backgroundColor: 'white', padding: '1rem'}}>
                            <Link href="/">
                                <a style={{fontSize: '1.1rem'}}>
                                    <LeftOutlined /> Back
                                </a>
                            </Link>
                        </div>
                        제목
                        <Input placeholder="Title" onChange={e => setBingoTitle(e.target.value)} />
                        닉네임
                        <Input placeholder="Name" onChange={e => setBingoAuthor(e.target.value)} />
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
                            <Radio.Button value="7">7</Radio.Button>
                        </Radio.Group>

                        배경색 설정
                        <div>
                            <TwitterPicker color={bingoBgMainColor} onChangeComplete={(v) => setBingoBgMainColor(v.hex)} />
                        </div>
                        서브 배경색 설정
                        <div>
                            <TwitterPicker color={bingoBgSubColor} onChangeComplete={(v) => setBingoBgSubColor(v.hex)} />
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

                    </ControllerPage>
                </Col>
                <Col xs={24} sm={24} md={24} lg={24} xl={24} >
                    {/* <Checkbox onChange={e => console.log(e)}>NSFW</Checkbox> */}
                    <BingoRenderer title={bingoTitle}
                    author={bingoAuthor}
                    size={bingoSize}
                    elements={bingoArr}
                    elementOnClickEvent={openIndexedModal}
                    selectedIndex={[]}
                    bgMainColor={bingoBgMainColor}
                    bgSubColor={bingoBgSubColor}
                    fontColor={bingoFontColor}
                    cellColor={bingoCellColor}
                    lineColor={bingoLineColor}
                    linePixel={bingoLinePixel}
                    />
                    <Modal
                    title="내용 변경"
                    visible={modalOpened}
                    onOk={() => changeElement(modalWillChangeInput, modalWillChangeIndex)}
                    onCancel={() => setModalOpened(false)}
                    >
                        <Input value={modalWillChangeInput} onChange={e => setModalWillChangeInput(e.target.value)} />
                    </Modal>

                    <CenteredCol>
                        <Button type="primary" onClick={handleSubmit} style={{width: '50%'}}>Submit</Button>
                    </CenteredCol>
                </Col>
            </Row>
        </>
    )
}
