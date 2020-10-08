import styled from 'styled-components'
import Modal from 'antd/lib/modal/Modal'
import { useState, useCallback, useEffect, useRef } from 'react'
import { Input, Spin, Row, Col, message } from 'antd'
import { CenteredRow, CenteredCol } from './sub/styled'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import pickTextColorBasedOnBgColor from '../logics/pickTextColorBasedOnBgColor'
import useWindowSize from '../logics/useWindowSize'
import { ShareAltOutlined, CameraFilled } from '../assets/icons'
import { serverUrl } from '../lib/serverUrl'
import { useRouter } from 'next/router'
import useIsMobile from '../logics/useIsMobile'
import { useTranslation } from '../i18n'

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
    color: ${props => props.selected ? 'dodgerblue' : 'gray' };
    :hover {
        background-color: var(--mono-2);
        color: ${props => props.selected ? 'dodgerblue' : 'var(--mono-7)' };
    }
`

const CreatePage = styled.div`
    background: ${(props) => `-webkit-linear-gradient(${props.bgMainColor}, ${props.bgSubColor})` };
    width: 100%;
    padding: 1rem;
    border: 1px solid lightgray;
`

const ResultPage = styled.div`
    /* margin-top: 8px; */
    margin-top: -1px;
    border: 1px solid lightgray;
    border-radius: 3px;
    background-color: white;
    padding: 1rem;
`

const TitleText = styled.div`
    color: ${props => props.color};
    font-weight: bold;
    font-size: 1.6rem;
`

const AuthorText = styled.div`
    color: ${props => props.color};
    font-weight: bold;
    font-size: 0.8rem;
`

const DescText = styled.div`
    color: ${props => props.color};
    font-size: 0.8rem;
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
        resultPercent, 

        takeScreenShot,
    } = props

    const router = useRouter()
    const isMobile = useIsMobile()
    const ref = useRef(null)

    const [ width, height ] = useWindowSize()

    useEffect(() => {
        setCellWidth(ref.current ? ref.current.offsetWidth : 0)
    }, [ width, height ])

    const [ cellWidth, setCellWidth ] = useState(0)

    const renderTable = (size) => {
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
                                    border: `${linePixel}px solid ${lineColor}`, 
                                    backgroundColor: `${selectedIndex.includes(index) ? markColor : 'white'}`, 
                                    backgroundImage: markStyle === 'paint' ? null : `url("/static/images/${markStyle}.png")`, 
                                    backgroundSize: 'cover'
                                }} 
                                onClick={() => elementOnClickEvent(index)}>
                                    <a>
                                        <div style={{width: (cellWidth - 50) / size, height: (cellWidth - 50) / size, display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center', color: `${fontColor}`, overflow: 'hidden', fontSize: cellWidth / size / 9}}>
                                            {v}
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

    const backColor = (percentage) => {
        if(0 <= percentage && percentage <= 20) return 0.1
        else if(20 < percentage && percentage <= 40) return 0.15
        else if(40 < percentage && percentage <= 60) return 0.25
        else if(60 < percentage && percentage <= 80) return 0.5
        else if(80 < percentage && percentage <= 100) return 0.8
    }

    const renderResultTable = (size) => {
        let rows = []

        for(let i = 0; i < size; i++){
            rows.push(
                <tr key={i}>
                    {resultPercent.map((v, index) => {
                        if( size * i <= index && index < size * (i+1) ){
                            return (
                                <td key={index} style={{border: '1px solid black', backgroundColor: `rgba(255,255,0, ${backColor(v)})`, textAlign: 'center', color: `${selectedIndex.includes(index) ? 'dodgerblue' : 'black'}`, padding: '4px 8px'}}>
                                    {v}%
                                    <div style={{fontSize: '0.8rem'}}>({resultCount[index]}회) </div>
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
        <div id='captureWithResult' style={{width: '100%'}}>
            <CreatePage ref={ref} bgMainColor={bgMainColor} bgSubColor={bgSubColor} id="captureWithoutResult">
                <CenteredCol>
                    <TitleText color={pickTextColorBasedOnBgColor(bgMainColor, '#ffffff', '#000000')}>
                        {title} 
                    </TitleText>
                    <AuthorText color={pickTextColorBasedOnBgColor(bgMainColor, '#ffffff', '#000000')}>
                        by {author}
                    </AuthorText>
                    <DescText color={pickTextColorBasedOnBgColor(bgMainColor, '#ffffff', '#000000')}>
                        {description}
                    </DescText>
                    <table style={{}}>
                        <tbody>
                            {renderTable(size)}
                        </tbody>
                    </table>
                    <div style={{color: `${pickTextColorBasedOnBgColor(bgMainColor, '#ffffff', '#000000')}`, fontWeight: 'bold', fontSize: '1.3rem', marginTop: '0.5rem'}}>
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
                    <Row>
                        <Col xs={24} sm={12} md={12} lg={12} xl={12} >
                            <CenteredCol>
                                <CenteredCol style={{borderBottom: '1px solid lightgray', width: '100%'}}>
                                    <div style={{color: 'black', fontWeight: 'bold', fontSize: '1rem'}}>
                                        완성된 빙고 개수 : {completedBingoLines}
                                    </div>
                                    <div style={{color: 'black', fontWeight: 'bold', fontSize: '1.4rem', marginTop: '0.3rem'}}>
                                        "{resultString}"
                                    </div>
                                </CenteredCol>
                                <CenteredRow style={{marginTop: '1rem', marginBottom: '1rem'}}>
                                    <MenuButton>
                                        <CopyToClipboard text={serverUrl + router.asPath}
                                        onCopy={() => message.success(t("MODAL_SHARE_LINK"))}>
                                            <span><ShareAltOutlined /> Share</span>
                                        </CopyToClipboard>
                                    </MenuButton>
                                    <MenuButton onClick={() => takeScreenShot('captureWithResult')}>
                                        <span><CameraFilled /> Capture with Result</span>
                                    </MenuButton>
                                </CenteredRow>
                            </CenteredCol>
                        </Col>
                        <Col xs={24} sm={12} md={12} lg={12} xl={12} >
                            <CenteredCol style={{fontWeight: 'bold'}}>유저 선택 비율 통계</CenteredCol>
                            <CenteredCol>
                                <table>
                                    <tbody>
                                        {renderResultTable(size)}
                                    </tbody>
                                </table>
                            </CenteredCol>
                        </Col>
                    </Row>
                </ResultPage>
            }
        </div>
    )
}