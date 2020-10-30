import styled from 'styled-components'
import Modal from 'antd/lib/modal/Modal'
import { useState, useCallback, useEffect, useRef } from 'react'
import { Input, Spin, Row, Col, message } from 'antd'
import { CenteredRow, CenteredCol } from './sub/styled'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import pickTextColorBasedOnBgColor from '../logics/pickTextColorBasedOnBgColor'
import useWindowSize from '../logics/useWindowSize'
import { ShareAltOutlined, CameraFilled, UserOutlined, SearchOutlined } from '../assets/icons'
import { serverUrl } from '../lib/serverUrl'
import { useRouter } from 'next/router'
import useIsMobile from '../logics/useIsMobile'
import { useTranslation } from '../i18n'
import MarkStyleSVG from './sub/MarkStyleSVG'

message.config({
    top: 58,
})

const MenuButton = styled.a`
    border-radius: 3px;
    background-color: ${props => props.selected ? 'var(--mono-1)' : 'white' };
    height: 25px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0px 8px;
    margin: 4px;
    color: ${props => props.selected ? 'dodgerblue' : 'gray' };
    :hover {
        background-color: var(--mono-2);
        color: ${props => props.selected ? 'dodgerblue' : 'var(--mono-7)' };
    }
`

const CreatePage = styled.div`
    ${(props) => props.bgSubColor === '' ?
    `background-color: ${props.bgMainColor};`
    :
    `background: -webkit-linear-gradient(${props.bgMainColor}, ${props.bgSubColor})` };
    width: 100%;
    max-width: 800px;
    padding: 1rem;
    border: 1px solid lightgray;
`

const ResultPage = styled.div`
    margin-top: 8px;
    width: 100%;
    /* margin-top: -1px; */
    border: 1px solid lightgray;
    border-radius: 3px;
    background-color: white;
    padding: 1rem;
`

const TitleText = styled.div`
    width: 100%;
    text-align: center;
    color: ${props => props.color};
    font-weight: bold;
    font-size: ${props => props.cellWidth * 0.05}px;
`

const DescText = styled.div`
    color: ${props => props.color};
    font-size: ${props => props.cellWidth * 0.03}px;
`

const ResultBox = styled.div`
    background-color: ${props => props.bgColor};
    color: white;
    width: 100%;
    height: 120px;
    padding: 16px;
    border: 1px solid var(--mono-2);
`

const MiniTextInResultBox = styled.div`
    font-size: 14px;
    font-weight: bold;
`

const BigTextInResultBox = styled.div`
    font-size: 24px;
`

export default function BingoRenderer( props ){
    const { t, i18n } = useTranslation()
    
    const { 
        title, 
        description, 
        author, 
        size, 
        elements, 
        elementOnClickEvent, 
        selectedIndex, 
        bgMainColor, 
        bgSubColor, 
        fontColor, 
        cellColor, 
        lineColor, 
        linePixel, 
        ipAddress, 

        markStyle,
        markColor,

        completedBingoLines, 
        resultString, 
        resultStatus, 
        resultCount, 
        resultAvgCount, 
        resultAvgBingoLines,
        resultPercent, 

        takeScreenShot,
    } = props

    const router = useRouter()
    // const isMobile = useIsMobile()
    const ref = useRef(null)

    const [ width, height ] = useWindowSize()

    useEffect(() => {
        setCellWidth(ref.current ? ref.current.offsetWidth : 0)
    }, [ width, height ])

    const [ cellWidth, setCellWidth ] = useState(0)
    const [ resultTableModalVisible, setResultTableModalVisible ] = useState(false)

    const renderTable = (size, baseWidth) => {
        let rows = []
        
        for(let i = 0; i < size; i++){
            rows.push(
                <tr key={i}>
                    {elements.map((v, index) => {
                        if( size * i <= index && index < size * (i+1) ){
                            return (
                                <td 
                                key={index} 
                                style={{
                                    border: `${width < 768 ? 1 : 2}px solid ${lineColor}`, 
                                    backgroundColor: markStyle === 'paint' && selectedIndex.includes(index) ? markColor 
                                    : cellColor !== '' ? cellColor : ''
                                    // backgroundColor: `${selectedIndex.includes(index) ? markColor : 'white'}`, 
                                    // backgroundImage: markStyle === 'paint' ? null : `url("/static/images/${markStyle}.png")`, 
                                    // backgroundSize: 'cover'
                                }} 
                                onClick={() => elementOnClickEvent(index)}>
                                    <a>
                                        {
                                            markStyle !== 'paint' && selectedIndex.includes(index) && 
                                            <MarkStyleSVG markStyle={markStyle} markColor={markColor} markWidth={(baseWidth - 50) / size} />
                                        }
                                        <div 
                                        style={{
                                            width: (baseWidth - 50) / size, 
                                            height: (baseWidth - 50) / size, 
                                            display: 'flex', 
                                            justifyContent: 'center', 
                                            alignItems: 'center', 
                                            textAlign: 'center', 
                                            color: `${fontColor}`, 
                                            fontSize: baseWidth / size / 9,
                                            overflow: 'hidden'
                                        }}>
                                            <span style={{width: (baseWidth - 50) / size, 
                                            height: (baseWidth - 50) / size,
                                            display: 'flex', 
                                            justifyContent: 'center', 
                                            alignItems: 'center', 
                                            position: 'absolute', 
                                            zIndex: 10, 
                                            overflow: 'hidden'}}>
                                                {v}
                                            </span>
                                        </div>
                                    </a>
                                </td>
                            )
                        }
                    })}
                </tr>
            )
        }
        return rows
    }

    const backColor = (percent) => {
        let r = percent<50 ? 255 : Math.floor(255-(percent*2-100)*255/100);
        let g = percent>50 ? 255 : Math.floor((percent*2)*255/100);
        return 'rgb('+r+', '+g+', 0, 0.6)';
    }

    const renderResultTable = (size) => {
        let rows = []

        for(let i = 0; i < size; i++){
            rows.push(
                <tr key={i}>
                    {resultPercent.map((v, index) => {
                        if( size * i <= index && index < size * (i+1) ){
                            return (
                                <td key={index} style={{border: '1px solid black', backgroundColor: `${backColor(v)}`, textAlign: 'center', color: `${selectedIndex.includes(index) ? 'black' : 'var(--mono-6)'}`, padding: '4px 8px'}}>
                                    <span style={{fontWeight: 'bold'}}>{v}%</span>
                                    <div style={{fontSize: '0.8rem'}}><UserOutlined />{resultCount[index]} </div>
                                </td>
                            )
                        }
                    })}
                </tr>
            )
        }
        return rows            
    }

    return (
        <div id='captureWithResult' style={{width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
            <CreatePage ref={ref} bgMainColor={bgMainColor} bgSubColor={bgSubColor} id="captureWithoutResult">
                <CenteredCol>
                    <TitleText cellWidth={cellWidth} color={pickTextColorBasedOnBgColor(bgMainColor, '#ffffff', '#000000')}>
                        {title}
                    </TitleText>
                    {/* <AuthorText color={pickTextColorBasedOnBgColor(bgMainColor, '#ffffff', '#000000')}>
                        {author}
                    </AuthorText> */}
                    <DescText cellWidth={cellWidth} color={pickTextColorBasedOnBgColor(bgMainColor, '#ffffff', '#000000')}>
                        {description}
                    </DescText>
                    <table style={{}}>
                        <tbody>
                            {renderTable(size, cellWidth)}
                        </tbody>
                    </table>
                    <div style={{color: `${pickTextColorBasedOnBgColor(bgSubColor ? bgSubColor : bgMainColor, '#ffffff', '#000000')}`, fontWeight: 'bold', fontSize: cellWidth * 0.03, marginTop: '0.5rem'}}>
                        SelfBingo.com
                    </div>
                </CenteredCol>
            </CreatePage>
            {
                resultStatus === 'idle' || resultStatus === undefined ? null
                : resultStatus === 'saving' ? <CenteredRow style={{height: 300}}><Spin /> 데이터를 저장 중 입니다.</CenteredRow>
                : resultStatus === 'calculating' ? <CenteredRow style={{height: 300}}><Spin /> 데이터를 계산 중 입니다.</CenteredRow>
                : 
                <ResultPage>
                    {
                        resultString !== '' &&
                        <Row style={{padding: 8}}>
                            <div style={{width: '100%', minHeight: 60, backgroundColor: bgMainColor, fontSize: 24, textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: pickTextColorBasedOnBgColor(bgMainColor, '#ffffff', '#000000'), border: '1px solid var(--mono-2)'}}>
                                <div style={{fontSize: 12}}>당신은</div>
                                {resultString}
                            </div>
                        </Row>
                    }
                    <Row>
                        <Col xs={12} sm={8} md={8} lg={8} xl={8} style={{padding: 8}}>
                            <ResultBox bgColor={'#4285F4'}>
                                <MiniTextInResultBox>
                                    Your Marks
                                </MiniTextInResultBox>
                                <BigTextInResultBox>
                                    {selectedIndex.length}
                                    <span style={{fontSize: 12, marginLeft: 16}}>Avg : {resultAvgCount.toFixed(2)}</span>
                                </BigTextInResultBox>
                            </ResultBox>
                        </Col>
                        <Col xs={12} sm={8} md={8} lg={8} xl={8} style={{padding: 8}}>
                            <ResultBox bgColor={'#0F9D58'}>
                                <MiniTextInResultBox>
                                    Completed Lines
                                </MiniTextInResultBox>
                                <BigTextInResultBox>
                                    {completedBingoLines}
                                    <span style={{fontSize: 12, marginLeft: 16}}>Avg : {resultAvgBingoLines.toFixed(2)}</span>
                                </BigTextInResultBox>
                            </ResultBox>
                        </Col>
                        <Col xs={12} sm={8} md={8} lg={8} xl={8} style={{padding: 8}}>
                            <ResultBox bgColor={'#F4B400'}>
                                <MiniTextInResultBox>
                                    {t("PLAYPAGE_PERCENTAGE_STATS")}
                                </MiniTextInResultBox>
                                <BigTextInResultBox onClick={() => setResultTableModalVisible(true)}>
                                    <a style={{color: 'white'}}>보기 <SearchOutlined style={{fontSize: 16}} /></a>
                                </BigTextInResultBox>
                            </ResultBox>
                        </Col>
                        <Col xs={12} sm={24} md={24} lg={24} xl={24} style={{padding: 8}}>
                            <CenteredCol style={{border: '0px solid var(--mono-2)'}}>
                                <MenuButton>
                                    <CopyToClipboard text={serverUrl + router.asPath}
                                    onCopy={() => message.success(t("MODAL_SHARE_LINK"))}>
                                        <span><ShareAltOutlined /> {t("PLAYPAGE_SHARE")}</span>
                                    </CopyToClipboard>
                                </MenuButton>
                                <MenuButton onClick={() => takeScreenShot('captureWithResult')}>
                                    <span><CameraFilled /> {t("PLAYPAGE_CAPTURE")} with Result</span>
                                </MenuButton>
                                <MenuButton onClick={() => takeScreenShot('captureWithoutResult')}>
                                    <span><CameraFilled /> {t("PLAYPAGE_CAPTURE")}</span>
                                </MenuButton>
                            </CenteredCol>
                        </Col>
                    </Row>
                    <Modal
                    closable
                    title={t("PLAYPAGE_PERCENTAGE_STATS")}
                    visible={resultTableModalVisible}
                    footer={null}
                    onCancel={() => setResultTableModalVisible(false)}
                    // style={{top: '55%'}}
                    centered
                    // mask={false}
                    >
                        <CenteredCol>
                            <table style={{}}>
                                <tbody>
                                    {renderTable(size, width < 768 ? cellWidth : cellWidth/2)}
                                </tbody>
                            </table>
                            <div style={{margin: 16}} />
                            <table>
                                <tbody>
                                    {renderResultTable(size)}
                                </tbody>
                            </table>
                        </CenteredCol>
                    </Modal>
                </ResultPage>
            }
        </div>
    )
}