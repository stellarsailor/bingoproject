import React, { useState, useEffect, useCallback, useContext } from 'react'
import { useSession, signIn } from 'next-auth/client'
import { NextSeo } from 'next-seo'
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
import { Row, Col, Input, Radio, Select, Modal, InputNumber, Button, message, Slider, Checkbox } from 'antd';
import LoginContainer from '../../components/LoginContainer'
import CreateButtonTab from '../../components/sub/CreateButtonTab'
import useWindowSize from '../../logics/useWindowSize'
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

const TopBar = styled.div`
    background: -webkit-linear-gradient(45deg, dodgerblue, darkblue);
    width: 100%;
    height: 60px;
    background-color: dodgerblue;
    padding-top: 1rem;
    padding-left: 1rem;
`

const TextLabel = styled.div`
    color: var(--mono-2);
    font-weight: bold;
    font-size: 1rem;
    margin-bottom: 8px;
`

const ControllerPage = styled.div`
    background-color: #293039;
    color: white;
    /* border: 1px solid lightgray; */
    width: ${props => props.width < 768 ? '100%' : '350px'};
    padding: 1rem;
`

const ColorSquare = styled.div`
    width: 120px;
    height: 30px;
    background-color: ${props => props.color};
    border-radius: 6px;
    border: 1px solid lightgray;
    margin-left: 16px;
    margin-bottom: 16px;
    &:hover {
        cursor: pointer;
    }
`

const ColorTab = styled.span`
    /* display: flex;
    flex-direction: row; */
    margin: 8px 0px;
`

const initialColorArray = [ '#f8bbd0', '#e1bee7', '#ffe0b2', '#b2dfdb', '#f06292', '#fff9c4', '#009688', '#5d4037', '#303f9f', '#000000']

export default function BingoCreate() {
    const { t, i18n } = useTranslation()
    const [ session, loading ] = useSession()
    const [ width, height ] = useWindowSize()
    const { categoryList } = useContext(InitialContents)
    
    const [ selectedButton, setSelectedButton ] = useState(0)

    const [ bingoCategory, setBingoCategory ] = useState<any>(0)
    // const [ bingoPassword, setBingoPassword ] = useState('')
    const [ bingoTitle, setBingoTitle ] = useState('')
    const [ bingoDescription, setBingoDescription ] = useState('')
    const [ bingoAuthor, setBingoAuthor ] = useState('')
    const [ bingoSize, setBingoSize ] = useState(5)
    const [ bingoArr, setBingoArr ] = useState([])

    const [ colorPickerKey, setColorPickerKey ] = useState('')

    const [ bingoBgMainColor, setBingoBgMainColor ] = useState(initialColorArray[Math.floor(Math.random() * initialColorArray.length)])
    const [ allowGradient, setAllowGradient ] = useState(false)
    const [ bingoBgSubColor, setBingoBgSubColor ] = useState('')
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
        // if(bingoAuthor === '') blankError.push(t("CREATE_EMPTY_ALERT_NAME"))
        // if(bingoPassword === '') blankError.push(t("CREATE_EMPTY_ALERT_PASSWORD"))
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
                    // lock: 0,
                    // author: bingoAuthor,
                    userId: session.user.id,
                    // password: bingoPassword,
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
                    // linePixel: bingoLinePixel,
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
    },[bingoTitle, bingoDescription, bingoAuthor, bingoCategory, bingoSize, bingoArr, bingoBgMainColor, bingoBgSubColor, bingoFontColor, bingoCellColor, bingoLineColor, bingoLinePixel, bingoAchievement])

    if (loading) {
        return <p>Loading…</p>
    }

    if (!loading && !session) {
        Router.push('/auth/signin')
        return <p style={{fontSize: '1rem'}}>To make a bingo, You have to Sign in.</p>
    }

    return(
        <>
            <NextSeo
            title="Create Self Bingo"
            description="Make Your Bingo and Share It!"
            />
            <TopBar>
                <Link href="/">
                    <a style={{fontSize: '1.1rem', color: 'white'}}>
                        <LeftOutlined /> Back
                    </a>
                </Link>
            </TopBar>
            <Row style={{width: '100%'}}> 
                <Col style={{maxWidth: width < 768 ? width : 768, display: 'flex', flexDirection: width < 768 ? 'column' : 'row' }}>
                    <CreateButtonTab selectedButton={selectedButton} setSelectedButton={setSelectedButton} />
                    <ControllerPage width={width}>
                        {/* <div style={{borderBottom: '1px solid var(--mono-2)', paddingBottom: '1rem'}}> */}
                            {/* <Input placeholder={t("CREATE_PLACEHOLDER_AUTHOR")} value={session.user.name} onChange={e => setBingoAuthor(e.target.value)} style={{width: '45%', marginRight: 16}} /> */}
                            {/* <Input.Password placeholder={t("CREATE_PLACEHOLDER_PASSWORD")} onChange={e => setBingoPassword(e.target.value)} style={{width: '45%'}} /> */}
                        {/* </div> */}
                        {
                            selectedButton === 0 && 
                            <>
                                <Select placeholder={t("CREATE_PLACEHOLDER_CATEGORY")} style={{ width: 200, margin: '1rem 0px', marginRight: 16 }} onChange={v => setBingoCategory(v)}>
                                    {categoryList.slice(1).map((v, index) => <Option key={index} value={index}>{v.name_ko}</Option>)}
                                </Select>

                                <Input placeholder={t("CREATE_PLACEHOLDER_TITLE")} onChange={e => setBingoTitle(e.target.value)} style={{width: '100%', height: 40, borderRadius: 5}} />
                                
                                <Input placeholder={t("CREATE_PLACEHOLDER_DESC")} onChange={e => setBingoDescription(e.target.value)} style={{width: '100%', height: 35, margin: '1rem 0px', borderRadius: 5}} />

                                <div style={{margin: '1rem 0px'}}>
                                    <TextLabel>
                                        {t("CREATE_BINGO_SIZE")}
                                    </TextLabel>
                                    <Radio.Group defaultValue={bingoSize} onChange={(e) => setBingoSize(e.target.value)} >
                                        <Radio.Button value={3} style={{width: 80, textAlign: 'center'}}>3x3</Radio.Button>
                                        <Radio.Button value={5} style={{width: 80, textAlign: 'center'}}>5x5</Radio.Button>
                                        {/* <Radio.Button value="7">7x7</Radio.Button> */}
                                    </Radio.Group>
                                </div>
                            </>
                        }
                        {
                            selectedButton === 1 &&
                            <>
                                <ColorTab onClick={() => setColorPickerKey('bingoLineColor')}>
                                    <TextLabel>{t("CREATE_LINE_COLOR")}</TextLabel>
                                    <ColorSquare color={bingoLineColor} />
                                </ColorTab>
                                {
                                    colorPickerKey === 'bingoLineColor' &&
                                    <CenteredCol>
                                        <SwatchesPicker color={bingoLineColor} onChangeComplete={(v) => {setBingoLineColor(v.hex); setColorPickerKey('');}} />
                                    </CenteredCol>
                                }

                                {/* <ColorTab>
                                    <div style={{width: 120}}>
                                        {t("CREATE_LINE_THICK")}
                                    </div>
                                    <div>
                                        <InputNumber min={1} max={3} defaultValue={2} onChange={(v: number) => setBingoLinePixel(v)} style={{width: 60}} />
                                    </div>
                                </ColorTab> */}

                                {/* <ColorTab onClick={() => setColorPickerKey('bingoCellColor')}>
                                    <TextLabel>셀 배경색 설정</TextLabel>
                                    <ColorSquare color={bingoCellColor} />
                                </ColorTab>
                                {
                                    colorPickerKey === 'bingoCellColor' &&
                                    <CenteredCol>
                                        <SwatchesPicker color={bingoCellColor} onChangeComplete={(v) => {setBingoCellColor(v.hex); setColorPickerKey('');}} />
                                    </CenteredCol>
                                } */}

                                <ColorTab onClick={() => setColorPickerKey('bingoFontColor')}>
                                    <TextLabel>{t("CREATE_FONT_COLOR")}</TextLabel>
                                    <ColorSquare color={bingoFontColor} />
                                </ColorTab>
                                {
                                    colorPickerKey === 'bingoFontColor' &&
                                    <CenteredCol>
                                        <SwatchesPicker color={bingoFontColor} onChangeComplete={(v) => {setBingoFontColor(v.hex); setColorPickerKey('');}} />
                                    </CenteredCol>
                                }
                            </>
                        }
                        {
                            selectedButton === 2 &&
                            <>
                                <ColorTab onClick={() => setColorPickerKey('bingoBgMainColor')}>
                                    <TextLabel>{t("CREATE_BACKGROUND_COLOR")}</TextLabel>
                                    <ColorSquare color={bingoBgMainColor} />
                                </ColorTab>
                                {
                                    colorPickerKey === 'bingoBgMainColor' && 
                                    <CenteredCol>
                                        <SwatchesPicker color={bingoBgMainColor} onChangeComplete={(v) => {
                                            if(!allowGradient) setBingoBgSubColor('')
                                            setBingoBgMainColor(v.hex); 
                                            setColorPickerKey('');
                                            }} />
                                    </CenteredCol>
                                }

                                <Checkbox 
                                checked={allowGradient}
                                style={{color: 'var(--mono-2)', marginBottom: 8}}
                                onChange={e => {
                                    bingoBgSubColor !== '' && setBingoBgSubColor('')
                                    setAllowGradient(e.target.checked)
                                }}>
                                    그라데이션 활성화
                                </Checkbox>
                                {
                                    allowGradient && 
                                    <>
                                        <ColorTab onClick={() => setColorPickerKey('bingoBgSubColor')}>
                                            <TextLabel>{t("CREATE_SUB_BACKGROUND_COLOR")}</TextLabel>
                                            <ColorSquare color={bingoBgSubColor} />
                                        </ColorTab>
                                        {
                                            colorPickerKey === 'bingoBgSubColor' &&
                                            <CenteredCol>
                                                <SwatchesPicker color={bingoBgSubColor} onChangeComplete={(v) => {setBingoBgSubColor(v.hex); setColorPickerKey('');}} />
                                            </CenteredCol>
                                        }
                                    </>
                                }
                            </>
                        }
                        {
                            selectedButton === 3 &&
                            <>
                                <TextLabel>
                                    빙고 요소 일괄 편집
                                </TextLabel>
                                <div>
                                    준비 중
                                </div>
                                <div style={{marginTop: 32}}>
                                    빙고 칸을 클릭하여 빙고를 수정할 수도 있습니다!
                                </div>
                            </>
                        }
                        {
                            selectedButton === 4 &&
                            <>
                                <TextLabel>
                                    {t("CREATE_BINGO_ACCOMPLISHMENTS")}
                                </TextLabel>
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
                            </>
                        }
                    </ControllerPage>
                </Col>
                <Col style={{width: width < 768 ? '100%' : 'calc(100% - 420px)', padding: '1rem', backgroundColor: 'white'}} >
                    <BingoRenderer 
                    title={bingoTitle}
                    // author={session.user.name}
                    description={bingoDescription}
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
