import React, { useState, useEffect, useCallback, useContext } from 'react'
import { Link } from '../../i18n'
import styled from 'styled-components'
// import ReCAPTCHA from "react-google-recaptcha";
import SwatchesPicker  from 'react-color/lib/Swatches'
import { serverUrl } from '../../lib/serverUrl'
import { useTranslation, Router } from '../../i18n';
import { InitialContents } from '../../store/InitialContentsProvider';
import { LeftOutlined, TableOutlined } from '../../assets/icons';
import BingoRenderer from '../../components/BingoRenderer';
import { CenteredCol, CenteredRow } from '../../components/sub/styled';
import { Row, Col, Input, Radio, Select, Modal, InputNumber, Button, message, Slider } from 'antd';
const { Option } = Select;
const marks = {
    0: '0',
    // 1: '1',
    2: '2',
    // 3: '3',
    4: '4',
    // 5: '5',
    6: '6',
    // 7: '7',
};

const ControllerPage = styled.div`
    background-color: white;
    border: 1px solid lightgray;
`

const ColorSquare = styled.div`
    width: 20px;
    height: 20px;
    background-color: ${props => props.color};
    border-radius: 4px;
    border: 1px solid lightgray;
`

const ColorTab = styled.span`
    display: flex;
    flex-direction: row;
    margin: 8px 0px;
`

const ColorLeftText = styled.span`
    width: 120px;
    margin-right: 16px;
`

export default function BingoCreate({ data, query, params }) {
    const { t, i18n } = useTranslation()
    const { categoryList } = useContext(InitialContents)

    const [ bingoCategory, setBingoCategory ] = useState<any>(0)
    const [ bingoPassword, setBingoPassword ] = useState('')
    const [ bingoTitle, setBingoTitle ] = useState('')
    const [ bingoDescription, setBingoDescription ] = useState('')
    const [ bingoAuthor, setBingoAuthor ] = useState('')
    const [ bingoSize, setBingoSize ] = useState(5)
    const [ bingoArr, setBingoArr ] = useState([])

    const [ colorPickerKey, setColorPickerKey ] = useState('')

    const [ bingoBgMainColor, setBingoBgMainColor ] = useState('#ffffff')
    const [ bingoBgSubColor, setBingoBgSubColor ] = useState('#0693E3')
    const [ bingoFontColor, setBingoFontColor ] = useState('#000000')
    const [ bingoLineColor, setBingoLineColor ] = useState('#000000')
    const [ bingoLinePixel, setBingoLinePixel ] = useState(2)
    const [ bingoCellColor, setBingoCellColor ] = useState('#ffffff')

    const [ bingoAchievement, setBingoAchievement ] = useState([])
    const [ achievementInput, setAchievementInput ] = useState('')
    const [ achievementMinimumPointer, setAchievementMinimumPointer ] = useState(0)
    const [ achievementPointer, setAchievementPointer ] = useState(3)

    const [ disableSubmitButton, setDisableSubmitButton ] = useState(false)
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
        let acheievements = []

        for(let i = 0; i < bingoSize*bingoSize; i++){
            elements.push('')
        }

        for(let i = 0; i < (bingoSize * 2 + 2) + 1; i++){
            acheievements.push('')
        }

        setBingoArr(elements)
        setBingoAchievement(acheievements)
    },[bingoSize])

    const handleAcheievement = useCallback((rangeMin, rangeMax, value) => {
        for(let i = rangeMin; i < rangeMax; i++){
            bingoAchievement[i] = value
        }
        setBingoAchievement([...bingoAchievement])
        setAchievementMinimumPointer(rangeMax)
        setAchievementPointer(bingoSize * 2 + 2)
        setAchievementInput('')
    },[bingoAchievement])

    const handleSubmit = useCallback(async () => {
        // console.log(bingoAchievement)
        let blankError = [] //에러는 역순으로
        bingoAchievement.map(v => {if(v === '' || v === null) blankError.push(t("CREATE_EMPTY_ALERT_ACCOMPLISHMENTS"))})
        bingoArr.map(v => {if(v === '' || v === null) blankError.push(t("CREATE_EMPTY_ALERT_ELEMENT"))})
        if(bingoAuthor === '') blankError.push(t("CREATE_EMPTY_ALERT_NAME"))
        if(bingoPassword === '') blankError.push(t("CREATE_EMPTY_ALERT_PASSWORD"))
        if(bingoTitle === '') blankError.push(t("CREATE_EMPTY_ALERT_TITLE"))

        if(blankError.length !== 0){
            message.error(blankError.pop())
        } else {
            setDisableSubmitButton(true)
            let url = `${serverUrl}/api/bingos?lang=${i18n.language}`
            const settings = {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    lock: 0,
                    author: bingoAuthor,
                    password: bingoPassword,
                    category: bingoCategory,
                    title: bingoTitle,
                    description: bingoDescription,
                    size: bingoSize,
                    elements: bingoArr,
                    bgMainColor: bingoBgMainColor,
                    bgSubColor: bingoBgSubColor,
                    fontColor: bingoFontColor,
                    cellColor: bingoCellColor,
                    lineColor: bingoLineColor,
                    linePixel: bingoLinePixel,
                    achievements: bingoAchievement
                })
            }
            try {
                const fetchResponse = await fetch(url, settings)
                const data = await fetchResponse.json()
    
                if(data.error === 'duplicated'){
                    message.error(t("STATIC_ERROR_TRY_LATER"))
                    setDisableSubmitButton(false)
                } else if (data.insertResult.affectedRows === 1){
                    Router.push(`/bingo/${data.insertResult.insertId}`)
                } else {
                    setDisableSubmitButton(false)
                }
    
            } catch (e) {
                return e;
            }
        }
    },[bingoPassword, bingoTitle, bingoDescription, bingoAuthor, bingoCategory, bingoSize, bingoArr, bingoBgMainColor, bingoBgSubColor, bingoFontColor, bingoCellColor, bingoLineColor, bingoLinePixel, bingoAchievement])

    return(
        <>
            <Row style={{paddingTop: 50}}>
                <Col xs={24} sm={24} md={24} lg={24} xl={24} style={{marginTop: 8, marginBottom: 8}}>
                    <ControllerPage>
                        <div style={{width: '100%', backgroundColor: 'white', paddingTop: '1rem', paddingLeft: '1rem'}}>
                            <Link href="/">
                                <a style={{fontSize: '1.1rem'}}>
                                    <LeftOutlined /> Back
                                </a>
                            </Link>
                        </div>
                        <div style={{padding: '1rem'}}>
                            <div style={{borderBottom: '1px solid var(--mono-2)', paddingBottom: '1rem'}}>
                                <Input placeholder={t("CREATE_PLACEHOLDER_AUTHOR")} onChange={e => setBingoAuthor(e.target.value)} style={{width: '45%', marginRight: 16}} />
                                <Input.Password placeholder={t("CREATE_PLACEHOLDER_PASSWORD")} onChange={e => setBingoPassword(e.target.value)} style={{width: '45%'}} />
                            </div>

                            {/* <Radio.Group defaultValue="a" style={{marginTop: 16}}>
                                <Radio.Button value="a">
                                    <GlobalOutlined /> 공개
                                </Radio.Button>
                                <Radio.Button value="b">
                                    <LockOutlined /> 일부공개
                                </Radio.Button>
                            </Radio.Group> */}

                            <div>
                                <Select placeholder={t("CREATE_PLACEHOLDER_CATEGORY")} style={{ width: 150, margin: '1rem 0px', marginRight: 16 }} onChange={v => setBingoCategory(v)}>
                                    {categoryList.map((v, index) => <Option key={index} value={index}>{v.name_ko}</Option>)}
                                </Select>
                            </div>

                            <Input placeholder={t("CREATE_PLACEHOLDER_TITLE")} onChange={e => setBingoTitle(e.target.value)} style={{width: '100%'}} />
                            
                            <Input placeholder={t("CREATE_PLACEHOLDER_DESC")} onChange={e => setBingoDescription(e.target.value)} style={{width: '100%', margin: '1rem 0px'}} />
    
                            <div style={{margin: '1rem 0px'}}>
                                <span style={{marginRight: 16}}>
                                    <TableOutlined /> {t("CREATE_BINGO_SIZE")}
                                </span>
                                <Radio.Group defaultValue={bingoSize} onChange={(e) => setBingoSize(e.target.value)}>
                                    <Radio.Button value={3}>3x3</Radio.Button>
                                    <Radio.Button value={5}>5x5</Radio.Button>
                                    {/* <Radio.Button value="7">7x7</Radio.Button> */}
                                </Radio.Group>
                            </div>

                            <ColorTab onClick={() => setColorPickerKey('bingoBgMainColor')}>
                                <ColorLeftText>{t("CREATE_BACKGROUND_COLOR")}</ColorLeftText>
                                <ColorSquare color={bingoBgMainColor} />
                            </ColorTab>
                            {
                                colorPickerKey === 'bingoBgMainColor' ? 
                                <CenteredCol>
                                    <SwatchesPicker color={bingoBgMainColor} onChangeComplete={(v) => {setBingoBgMainColor(v.hex); setColorPickerKey('');}} />
                                </CenteredCol>
                                : null
                            }

                            <ColorTab onClick={() => setColorPickerKey('bingoBgSubColor')}>
                                <ColorLeftText>{t("CREATE_SUB_BACKGROUND_COLOR")}</ColorLeftText>
                                <ColorSquare color={bingoBgSubColor} />
                            </ColorTab>
                            {
                                colorPickerKey === 'bingoBgSubColor' ? 
                                <CenteredCol>
                                    <SwatchesPicker color={bingoBgSubColor} onChangeComplete={(v) => {setBingoBgSubColor(v.hex); setColorPickerKey('');}} />
                                </CenteredCol>
                                : null
                            }

                            <ColorTab onClick={() => setColorPickerKey('bingoLineColor')}>
                                <ColorLeftText>{t("CREATE_LINE_COLOR")}</ColorLeftText>
                                <ColorSquare color={bingoLineColor} />
                            </ColorTab>
                            {
                                colorPickerKey === 'bingoLineColor' ? 
                                <CenteredCol>
                                    <SwatchesPicker color={bingoLineColor} onChangeComplete={(v) => {setBingoLineColor(v.hex); setColorPickerKey('');}} />
                                </CenteredCol>
                                : null
                            }

                            <ColorTab>
                                <div style={{width: 120}}>
                                    {t("CREATE_LINE_THICK")}
                                </div>
                                <div>
                                    <InputNumber min={1} max={3} defaultValue={2} onChange={(v: number) => setBingoLinePixel(v)} style={{width: 60}} />
                                </div>
                            </ColorTab>

                            {/* <ColorTab onClick={() => setColorPickerKey('bingoCellColor')}>
                                <ColorLeftText>셀 배경색 설정</ColorLeftText>
                                <ColorSquare color={bingoCellColor} />
                            </ColorTab>
                            {
                                colorPickerKey === 'bingoCellColor' ? 
                                <CenteredCol>
                                    <SwatchesPicker color={bingoCellColor} onChangeComplete={(v) => {setBingoCellColor(v.hex); setColorPickerKey('');}} />
                                </CenteredCol>
                                : null
                            } */}

                            <ColorTab onClick={() => setColorPickerKey('bingoFontColor')}>
                                <ColorLeftText>{t("CREATE_FONT_COLOR")}</ColorLeftText>
                                <ColorSquare color={bingoFontColor} />
                            </ColorTab>
                            {
                                colorPickerKey === 'bingoFontColor' ? 
                                <CenteredCol>
                                    <SwatchesPicker color={bingoFontColor} onChangeComplete={(v) => {setBingoFontColor(v.hex); setColorPickerKey('');}} />
                                </CenteredCol>
                                : null
                            }
                        </div>
                    </ControllerPage>
                </Col>
                <Col xs={24} sm={24} md={24} lg={24} xl={24} >
                    {/* <Checkbox onChange={e => console.log(e)}>NSFW</Checkbox> */}
                    <BingoRenderer 
                    title={bingoTitle}
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
                    title={t("CREATE_CHANGE_BINGO_ELEMENT")}
                    visible={modalOpened}
                    onOk={() => changeElement(modalWillChangeInput, modalWillChangeIndex)}
                    onCancel={() => setModalOpened(false)}
                    >
                        <Input 
                        key={modalWillChangeIndex} 
                        placeholder={bingoArr[modalWillChangeIndex]} 
                        value={modalWillChangeInput} 
                        onChange={e => setModalWillChangeInput(e.target.value)} 
                        onPressEnter={() => changeElement(modalWillChangeInput, modalWillChangeIndex)} 
                        autoFocus 
                        />
                    </Modal>

                    <ControllerPage style={{marginTop: 8, padding: '1rem'}}>
                        <div>
                            {t("CREATE_BINGO_ACCOMPLISHMENTS")}
                        </div>
                        {bingoAchievement.map((v, index) => <div key={index}>{index} {t("STATIC_BINGO")}: {v}</div>)}
                        <div>
                            {
                                achievementMinimumPointer === 0 ?
                                <div>
                                    <Slider 
                                    defaultValue={achievementPointer} 
                                    min={0} max={(bingoSize * 2 + 2) + 1} 
                                    onChange={v => setAchievementPointer(v)} 
                                    marks={marks}
                                    />
                                    <Input 
                                    style={{width: '70%'}} 
                                    value={achievementInput}
                                    onChange={e => setAchievementInput(e.target.value)} 
                                    onPressEnter={() => {handleAcheievement(0, achievementPointer, achievementInput)}}
                                    />
                                    <Button 
                                    style={{marginLeft: '1rem'}} 
                                    onClick={() => {handleAcheievement(0, achievementPointer, achievementInput)}}
                                    > 
                                        {t("STATIC_ADD")} 
                                    </Button>
                                </div>
                                :
                                <div>
                                    <Slider 
                                    range 
                                    value={[achievementMinimumPointer, achievementPointer]} 
                                    min={0} max={(bingoSize * 2 + 2) + 1} 
                                    onChange={v => {setAchievementMinimumPointer(v[0]); setAchievementPointer(v[1])}} 
                                    marks={marks}
                                    />
                                    <Input 
                                    style={{width: '70%'}}
                                    value={achievementInput}
                                    onChange={e => setAchievementInput(e.target.value)} 
                                    onPressEnter={() => {handleAcheievement(achievementMinimumPointer, achievementPointer, achievementInput)}}
                                    />
                                    <Button 
                                    style={{marginLeft: '1rem'}} 
                                    onClick={() => {handleAcheievement(achievementMinimumPointer, achievementPointer, achievementInput)}}
                                    > 
                                        {t("STATIC_ADD")}  
                                    </Button>
                                </div>
                            }
                        </div>
                    </ControllerPage>
                    {/* <ReCAPTCHA
                        sitekey="6LfRb88ZAAAAAEpPb5KLCz9J_fDvCX5QELAd3UDu"
                        onChange={e => console.log(e)}
                    /> */}

                    <CenteredCol style={{margin: '2rem', marginBottom: '3rem'}}>
                        <Button type="primary" onClick={handleSubmit} style={{width: 300, height: 45, borderRadius: 8}} disabled={disableSubmitButton}>
                            {t("STATIC_CREATE")}
                        </Button>
                    </CenteredCol>
                </Col>
            </Row>
        </>
    )
}
