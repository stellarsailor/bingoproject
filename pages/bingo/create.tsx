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
import { BgColorsOutlined, LeftOutlined, TableOutlined } from '../../assets/icons';
import BingoRenderer from '../../components/BingoRenderer';
import { CenteredCol, CenteredRow } from '../../components/sub/styled';
import { Row, Col, Input, Radio, Select, Modal, InputNumber, Button, message, Slider, Checkbox } from 'antd';
import CreateButtonTab from '../../components/sub/CreateButtonTab'
import useWindowSize from '../../logics/useWindowSize'
import shuffleArray from '../../logics/shuffleArray'
import BingoCreateInformationPane from '../../components/BingoCreateInformationPane'
import BingoCreateAchievementPane from '../../components/BingoCreateAchievementPane'
const { TextArea } = Input;
const { Option } = Select;

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
    margin-bottom: 8px;
    &:hover {
        cursor: pointer;
    }
`

const ColorTab = styled.span`
    margin: 8px 0px;
`

const TransparentText = styled.div`
    margin-left: 16px;
    margin-bottom: 8px;
    &:hover {
        cursor: pointer;
    }
`

const initialColorArray = [ '#f8bbd0', '#e1bee7', '#ffe0b2', '#b2dfdb', '#f06292', '#fff9c4', '#009688', '#5d4037', '#303f9f', '#000000']

export default function BingoCreate() {
    const { t, i18n } = useTranslation()
    const [ session, loading ] = useSession()
    const [ width, height ] = useWindowSize()
    const { categoryList } = useContext(InitialContents)
    
    const [ selectedButton, setSelectedButton ] = useState(0)
    const [ easyBingoEditCenterInput, setEasyBingoEditCenterInput ] = useState('')
    const [ easyBingoEditInput, setEasyBingoEditInput ] = useState('')

    const [ bingoCategory, setBingoCategory ] = useState<any>(0)
    const [ bingoTitle, setBingoTitle ] = useState('')
    const [ bingoDescription, setBingoDescription ] = useState('')
    const [ bingoSize, setBingoSize ] = useState(5)
    const [ bingoArr, setBingoArr ] = useState([])

    const [ colorPickerKey, setColorPickerKey ] = useState('')

    const [ bingoBgMainColor, setBingoBgMainColor ] = useState(initialColorArray[Math.floor(Math.random() * initialColorArray.length)])
    const [ allowGradient, setAllowGradient ] = useState(false)
    const [ bingoBgSubColor, setBingoBgSubColor ] = useState('')
    const [ bingoFontColor, setBingoFontColor ] = useState('#000000')
    const [ bingoLineColor, setBingoLineColor ] = useState('#000000')
    const [ bingoCellColor, setBingoCellColor ] = useState('#ffffff')

    const [ enableAchievement, setEnableAchievement ] = useState(false)
    const [ bingoAchievement, setBingoAchievement ] = useState([])

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

    const insertEasyEdit = useCallback(() => {
        let tempArr = []
        for(let i = 0; i < bingoSize * bingoSize; i++) tempArr.push('')

        let linesArray = easyBingoEditInput.split(/\r|\r\n|\n/) 
        // console.log(linesArray)
        let shuffledArray = shuffleArray(linesArray)
        // console.log(shuffledArray)
        tempArr.map( (v, index) => {
            if(index !== Math.floor(bingoSize * bingoSize / 2)) tempArr[index] = shuffledArray.pop() //insert except center
        })
        tempArr[Math.floor(bingoSize * bingoSize / 2)] = easyBingoEditCenterInput //insert center
        setBingoArr(tempArr)
    },[easyBingoEditCenterInput, easyBingoEditInput])

    useEffect(() => {
        let elements = []
        let achievements = []

        for(let i = 0; i < bingoSize*bingoSize; i++){
            elements.push('')
        }

        for(let i = 0; i < (bingoSize * 2 + 2) + 1; i++){
            achievements.push('')
        }

        setBingoArr(elements)
        setBingoAchievement(achievements)
    },[bingoSize])

    const handleSubmit = useCallback(async () => {
        let blankError = [] //에러는 역순으로
        if(enableAchievement){
            bingoAchievement.map(v => {if(v === '' || v === null) blankError.push(t("CREATE_EMPTY_ALERT_ACCOMPLISHMENTS"))})
        } //else, Achievement is disabled so not to check blank
        bingoArr.map(v => {if(v === '' || v === null) blankError.push(t("CREATE_EMPTY_ALERT_ELEMENT"))})
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
                    userId: session.user.id,
                    category: bingoCategory + 1, //due to cut 'All' category which is 0
                    title: bingoTitle,
                    description: bingoDescription,
                    size: bingoSize,
                    elements: bingoArr,
                    bgMainColor: bingoBgMainColor,
                    bgSubColor: bingoBgSubColor,
                    fontColor: bingoFontColor,
                    cellColor: bingoCellColor,
                    lineColor: bingoLineColor,
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
    },[bingoTitle, bingoDescription, bingoCategory, bingoSize, bingoArr, bingoBgMainColor, bingoBgSubColor, bingoFontColor, bingoCellColor, bingoLineColor, bingoAchievement, enableAchievement])

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
                        {
                            selectedButton === 0 && 
                            <>
                                <BingoCreateInformationPane 
                                categoryList={categoryList}
                                bingoCategory={bingoCategory}
                                setBingoCategory={setBingoCategory}
                                bingoTitle={bingoTitle}
                                setBingoTitle={setBingoTitle}
                                bingoDescription={bingoDescription}
                                setBingoDescription={setBingoDescription}
                                />

                                <div style={{margin: '1rem 0px'}}>
                                    <TextLabel>
                                        {t("CREATE_BINGO_SIZE")}
                                    </TextLabel>
                                    <Radio.Group defaultValue={bingoSize} onChange={(e) => setBingoSize(e.target.value)} >
                                        <Radio.Button value={3} style={{width: 80, textAlign: 'center'}}>3x3</Radio.Button>
                                        <Radio.Button value={5} style={{width: 80, textAlign: 'center'}}>5x5</Radio.Button>
                                    </Radio.Group>
                                </div>
                            </>
                        }
                        {
                            selectedButton === 1 &&
                            <>
                                <ColorTab>
                                    <TextLabel>{t("CREATE_LINE_COLOR")}</TextLabel>
                                    <ColorSquare color={bingoLineColor} onClick={() => setColorPickerKey('bingoLineColor')} />
                                </ColorTab>
                                {
                                    colorPickerKey === 'bingoLineColor' &&
                                    <CenteredCol>
                                        <SwatchesPicker color={bingoLineColor} onChangeComplete={(v) => {setBingoLineColor(v.hex); setColorPickerKey('');}} />
                                    </CenteredCol>
                                }

                                <ColorTab>
                                    <TextLabel>{t("CREATE_FONT_COLOR")}</TextLabel>
                                    <ColorSquare color={bingoFontColor} onClick={() => setColorPickerKey('bingoFontColor')} />
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
                                <ColorTab>
                                    <TextLabel>{t("CREATE_BACKGROUND_COLOR")}</TextLabel>
                                    <ColorSquare color={bingoBgMainColor} onClick={() => setColorPickerKey('bingoBgMainColor')} />
                                </ColorTab>
                                {
                                    colorPickerKey === 'bingoBgMainColor' && 
                                    <CenteredCol>
                                        <SwatchesPicker color={bingoBgMainColor} 
                                        onChangeComplete={(v) => {
                                            if(!allowGradient) setBingoBgSubColor('')
                                            setBingoBgMainColor(v.hex); 
                                            setColorPickerKey('');
                                        }} 
                                        />
                                    </CenteredCol>
                                }

                                <Checkbox 
                                checked={allowGradient}
                                style={{color: 'var(--mono-2)', marginBottom: 16}}
                                onChange={e => {
                                    bingoBgSubColor !== '' && setBingoBgSubColor('')
                                    setAllowGradient(e.target.checked)
                                }}>
                                    {t("CREATE_ENABLE_GRADIENT")}
                                </Checkbox>
                                {
                                    allowGradient && 
                                    <>
                                        <ColorTab>
                                            <TextLabel>{t("CREATE_SUB_BACKGROUND_COLOR")}</TextLabel>
                                            <ColorSquare color={bingoBgSubColor} onClick={() => setColorPickerKey('bingoBgSubColor')} />
                                        </ColorTab>
                                        {
                                            colorPickerKey === 'bingoBgSubColor' &&
                                            <CenteredCol>
                                                <SwatchesPicker color={bingoBgSubColor} onChangeComplete={(v) => {setBingoBgSubColor(v.hex); setColorPickerKey('');}} />
                                            </CenteredCol>
                                        }
                                    </>
                                }

                                <ColorTab>
                                    <TextLabel>{t("CREATE_CELL_COLOR")}</TextLabel>
                                    <ColorSquare color={bingoCellColor} onClick={() => setColorPickerKey('bingoCellColor')} />
                                    <TransparentText onClick={() => { setBingoCellColor(''); setColorPickerKey(''); }}>
                                        <BgColorsOutlined /> {t("CREATE_CELL_TRANSPARENT")}
                                    </TransparentText>
                                </ColorTab>
                                {
                                    colorPickerKey === 'bingoCellColor' &&
                                    <CenteredCol>
                                        <SwatchesPicker color={bingoCellColor} onChangeComplete={(v) => {setBingoCellColor(v.hex); setColorPickerKey('');}} />
                                    </CenteredCol>
                                }
                            </>
                        }
                        {
                            selectedButton === 3 &&
                            <>
                                <TextLabel>
                                    {t("CREATE_EDIT_EASY")}
                                </TextLabel>
                                <div>
                                    <Input 
                                    placeholder={t("CREATE_EDIT_EASY_CENTER_INPUT")} 
                                    value={easyBingoEditCenterInput}
                                    onChange={e => setEasyBingoEditCenterInput(e.target.value)} 
                                    style={{marginBottom: 8}} 
                                    />

                                    <TextArea 
                                    placeholder={t("CREATE_EDIT_EASY_INPUT")}
                                    value={easyBingoEditInput}
                                    // autoSize={{ minRows: 3, maxRows: 10 }}
                                    allowClear 
                                    // disabled={easyBingoEditInput.split(/\r|\r\n|\n/).length > bingoSize * bingoSize - 1}
                                    onChange={e => setEasyBingoEditInput(e.target.value)} 
                                    />
                                    {easyBingoEditInput.split(/\r|\r\n|\n/).length} / {bingoSize * bingoSize - 1} Lines
                                </div>
                                <CenteredCol>
                                    <Button onClick={() => insertEasyEdit()} style={{width: 80}}>
                                        {t("STATIC_INSERT")}
                                    </Button>
                                </CenteredCol>
                                <div style={{marginTop: 32}}>
                                    {t("CREATE_EDIT_EASY_TIP")}
                                </div>
                            </>
                        }
                        {
                            selectedButton === 4 && 
                            <>
                                <Checkbox 
                                checked={enableAchievement}
                                style={{color: 'var(--mono-2)', marginBottom: 8}}
                                onChange={e => {
                                    if(enableAchievement) { //when becomes false
                                        //handleAchievement(0, bingoSize * 2 + 2 + 1, '') // reset achievement, consider number.
                                        setEnableAchievement(e.target.checked)
                                    } else setEnableAchievement(e.target.checked)
                                }}>
                                    <span style={{marginLeft: 8}}>
                                        {t("CREATE_BINGO_ACCOMPLISHMENTS")}
                                    </span>
                                </Checkbox>
                                <BingoCreateAchievementPane
                                enableAchievement={enableAchievement}
                                bingoAchievement={bingoAchievement}
                                setBingoAchievement={setBingoAchievement}
                                bingoSize={bingoSize}
                                />
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
