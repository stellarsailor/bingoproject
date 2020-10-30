import React, { useState, useEffect, useCallback } from 'react'
import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/client'
import styled from 'styled-components'
import { useCookies } from 'react-cookie'
import { Row, Col, Button, Popconfirm, Input, message, Tooltip } from 'antd'
import { Link, useTranslation, Router } from '../../i18n'
import { Element , scroller } from 'react-scroll'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import domtoimage from 'dom-to-image'

import { serverUrl } from '../../lib/serverUrl'
import BingoRenderer from '../../components/BingoRenderer'
import { CenteredCol, CenteredRow } from '../../components/sub/styled'
import { ShareAltOutlined, LeftOutlined, AlertFilled, CameraFilled, CheckSquareOutlined, DeleteOutlined, LockOutlined } from '../../assets/icons'
import useIsMobile from '../../logics/useIsMobile'
import useWindowSize from '../../logics/useWindowSize'
import MarkStyleModal from '../../components/MarkStyleModal'
import ReportModal from '../../components/ReportModal'

message.config({
    top: 58,
})

const ControllerPage = styled.div`
    height: 50px;
    background-color: white;
    border: 1px solid lightgray;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0px 16px;
`

const MenuButton = styled.a`
    font-size: 18px;
    border-radius: 3px;
    background-color: ${props => props.selected ? 'var(--mono-1)' : 'white' };
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 4px 8px;
    margin-left: 0.6rem;
    color: ${props => props.selected ? 'dodgerblue' : 'gray' };
    :hover {
        background-color: var(--mono-2);
        color: ${props => props.selected ? 'dodgerblue' : 'var(--mono-7)' };
    }
`

export default function BingoDetail({ data }) {
    const [ session, loading ] = useSession()
    const router = useRouter()
    const { bingoId } = router.query
    const { t, i18n } = useTranslation()
    const isMobile = useIsMobile()
    const [ width, height ] = useWindowSize()
    const [ cookies, setCookie ] = useCookies(['setting'])

    const [ styleModal, setStyleModal ] = useState(false)
    const [ markStyle, setMarkStyle ] = useState('')
    const [ markColor, setMarkColor ] = useState('')
    
    const [ reportModal, setReportModal ] = useState(false)
    const [ passwordInput, setPasswordInput ] = useState('')

    const [ bingo, setBingo ] = useState(data.bingo)
    const [ selectedIndex, setSelectedIndex ] = useState([])
    const [ completedBingoLines, setCompletedBingoLines ] = useState(0) 

    const [ resultStatus, setResultStatus ] = useState('idle')
    const [ resultCount, setResultCount ] = useState([])
    const [ resultAvgCount, setResultAvgCount ] = useState(0)
    const [ resultAvgBingoLines, setResultAvgBingoLines ] = useState(0)
    const [ resultPercent, setResultPercent ] = useState([])

    useEffect(() => {
        //cookie 불러와서 설정이 있으면 그대로 세팅, 없으면 기본 마크 스타일 세팅
        if(cookies.setting === undefined){
            const defaultSetting = {style: 'circle', color: '#EB144C'}
            setCookie('setting', defaultSetting, { path: '/' })
            setMarkStyle(defaultSetting.style)
            setMarkColor(defaultSetting.color)
        } else {
            setMarkStyle(cookies.setting.style)
            setMarkColor(cookies.setting.color)
        }
    },[])

    const takeScreenShot = (id) => {
        let scale = 2

        if(isMobile) scale = 3
        else scale = 2

        let node = document.getElementById(id)
    
        const style = {
            transform: 'scale('+scale+')',
            transformOrigin: 'top left',
            width: node.offsetWidth + "px",
            height: node.offsetHeight + "px"
        }
        
        const option = {
            height: node.offsetHeight * scale,
            width: node.offsetWidth * scale,
            quality: 1,
            style
        }

        domtoimage.toJpeg(node, option)
        .then(function (dataUrl) {
            let link = document.createElement('a')
            link.download = `selfbingo.com-${bingo.title}.jpg`
            link.href = dataUrl
            link.click()
        })
    }

    const deleteBingo = async (passwordInput) => {
        let url = `${serverUrl}/api/bingos/${bingoId}`
        const settings = {
            method: 'DELETE',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                // password: passwordInput
                userId: session.user.id,
                accessToken: session.accessToken,
            })
        }
        try {
            const fetchResponse = await fetch(url, settings)
            const data = await fetchResponse.json()

            if(data.results === 'success'){
                Router.push('/')
                message.success('Bingo is successfully deleted.')
            } else if(data.results === 'wrong'){
                message.warning('Please check password.')
            } else {
                message.error('Error!')
            }
        } catch (e) {
            return e
        }    
    }

    const addIndexToSelected = useCallback((indexToPushPop) => {
        let nextIndexArray = []
        nextIndexArray = selectedIndex.includes(indexToPushPop) ? selectedIndex.filter(t => t !== indexToPushPop) : [...selectedIndex, indexToPushPop]
        setSelectedIndex(nextIndexArray)
    },[selectedIndex])

    useEffect(() => {
        let lines = 0
        let criteria = {
            3: [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]],
            5: [[0,1,2,3,4], [5,6,7,8,9], [10,11,12,13,14], [15,16,17,18,19], [20,21,22,23,24], 
                [0,5,10,15,20], [1,6,11,16,21], [2,7,12,17,22], [3,8,13,18,23], [4,9,14,19,24], 
                [0,6,12,18,24], [4,8,12,16,20]],
            7: [[0,1,2,3,4,5,6], [7,8,9,10,11,12,13], [14,15,16,17,18,19,20], [21,22,23,24,25,26,27], [28,29,30,31,32,33,34],[35,36,37,38,39,40,41],[42,43,44,45,46,47,48],
                [0,7,14,21,28,35,42],[1,8,15,22,29,36,43],[2,9,16,23,30,37,44],[3,10,17,24,31,38,45],[4,11,18,25,32,39,46],[5,12,19,26,33,40,47],[6,13,20,27,34,41,48],
                [0,8,16,24,32,40,48],[6,12,18,24,30,36,42]]
        }

        for(let m = 0; m < (bingo.size * 2) + 2; m++){
            let flag = true
            for(let i = 0; i < criteria[bingo.size][m].length; i++){
                if(!selectedIndex.includes(criteria[bingo.size][m][i])){
                    flag = false
                }
            }
            if(flag) lines++
        }
        setCompletedBingoLines(lines)

    },[selectedIndex])

    const submitIndexToFlag = useCallback(async () => {
        setResultStatus('saving')

        scroller.scrollTo('scroll-to-element', {
            duration: 1200,
            delay: 0,
            smooth: 'easeInOutQuart'
        })

        let arr = []
        for(let i = 0; i < bingo.size * bingo.size; i++){
            arr.push(selectedIndex.includes(i) ? 1 : 0 )
        }

        let url = `${serverUrl}/api/bingos/${bingoId}`
        const settings = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                binaryResult: arr,
                completedLines: completedBingoLines //added to calc
            })
        }
        try {
            const fetchResponse = await fetch(url, settings)
            const data = await fetchResponse.json()

            if(data.error === 'duplicated') {
                message.error('something wrong while inserting! try few minutes later!')
                // throw 'duplicated!'
            }
            setResultStatus('calculating')
            let resultLength = data.results.length
            let bingoLength = bingo.size * bingo.size //JSON.parse(data.results[0].binaryResult.length)

            let countArr = []
            for(let i = 0; i < bingoLength; i++ ){
                countArr.push(0)
            }

            let sumCompletedLines = 0

            data.results.map((v) => {
                JSON.parse(v.binaryResult).map((v, index) => {
                    if(typeof(v) === 'number') countArr[index] += v
                })
                sumCompletedLines += v.completedLines
            })

            let sumCount = 0
            countArr.map(v => sumCount += v)

            let percentArr = countArr.map(v => Math.round((v / resultLength) * 100))

            setResultCount(countArr)
            setResultAvgCount(sumCount / resultLength)
            setResultAvgBingoLines(sumCompletedLines / resultLength)
            setResultPercent(percentArr)
            setResultStatus('done')
        } catch (e) {
            return e;
        }    
    },[selectedIndex, completedBingoLines])

    return(
        <>
            <NextSeo
            title={bingo.title + ' - SelfBingo'}
            description={bingo.description}
            />
            <CenteredRow>
                <MarkStyleModal 
                markStyle={markStyle}
                setMarkStyle={setMarkStyle}
                markColor={markColor}
                setMarkColor={setMarkColor}
                visible={styleModal} 
                setStyleModal={setStyleModal} 
                />
                <ReportModal
                bingoId={bingoId}
                visible={reportModal}
                setReportModal={setReportModal}
                />
                <Row style={{width: '100%', maxWidth: height - 100}} >
                    <Col xs={24} sm={24} md={24} lg={24} xl={24} style={{marginBottom: 8}}>
                        <ControllerPage>
                            <Link href="/">
                                <a style={{fontSize: '1.1rem'}}>
                                    <LeftOutlined /> Back
                                </a>
                            </Link>
                            <CenteredRow>
                                <Tooltip title={t("PLAYPAGE_SETTING")}>
                                    <MenuButton onClick={() => setStyleModal(true)}>
                                        <CheckSquareOutlined /> 
                                    </MenuButton>
                                </Tooltip>
                                <Tooltip title={t("PLAYPAGE_REPORT")}>
                                    <MenuButton onClick={() => setReportModal(true)}>
                                        <AlertFilled /> 
                                    </MenuButton>
                                </Tooltip>
                                <Tooltip title={t("PLAYPAGE_SHARE")}>
                                    <MenuButton>
                                        <CopyToClipboard text={serverUrl + router.asPath}
                                        onCopy={() => message.success(t("MODAL_SHARE_LINK"))}>
                                            <ShareAltOutlined /> 
                                        </CopyToClipboard>
                                    </MenuButton>
                                </Tooltip>
                                <Tooltip title={t("PLAYPAGE_CAPTURE")}>
                                    <MenuButton onClick={() => takeScreenShot('captureWithoutResult')}>
                                        <CameraFilled /> 
                                    </MenuButton>
                                </Tooltip>
                                { session && session.user.id === bingo.userId ? 
                                    <Tooltip title={t("PLAYPAGE_DELETE")}>
                                        <MenuButton>
                                            <Popconfirm
                                                title={
                                                    <div> 
                                                        {/* <Input.Password placeholder="input password" onChange={(e) => setPasswordInput(e.target.value)} style={{width: 200}} /> */}
                                                        Do you want to delete this Bingo?
                                                    </div>
                                                }
                                                onConfirm={() => deleteBingo(passwordInput)}
                                                onCancel={() => console.log('cancelled')}
                                                okText="Delete"
                                                cancelText="Cancel"
                                                icon={<LockOutlined style={{fontSize: 16}} />}
                                            
                                            >
                                                <DeleteOutlined /> 
                                            </Popconfirm>
                                        </MenuButton>
                                    </Tooltip>
                                 : null}
                            </CenteredRow>
                        </ControllerPage>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24} >
                        {/* <Checkbox onChange={e => console.log(e)}>NSFW</Checkbox> */}
                        <CenteredCol>
                            <BingoRenderer 
                            title={bingo.title}
                            description={bingo.description}
                            author={bingo.author}
                            size={bingo.size}
                            elements={JSON.parse(bingo.elements)}
                            elementOnClickEvent={(i) => addIndexToSelected(i)}
                            selectedIndex={selectedIndex}
                            bgMainColor={bingo.bgMainColor}
                            bgSubColor={bingo.bgSubColor}
                            fontColor={bingo.fontColor}
                            cellColor={bingo.cellColor}
                            lineColor={bingo.lineColor}
                            linePixel={bingo.linePixel}
                            ipAddress={bingo.ipAddress}

                            markStyle={markStyle}
                            markColor={markColor}

                            completedBingoLines={completedBingoLines}
                            resultString={JSON.parse(bingo.achievements)[completedBingoLines]}
                            resultStatus={resultStatus}
                            resultCount={resultCount}
                            resultAvgCount={resultAvgCount}
                            resultAvgBingoLines={resultAvgBingoLines}
                            resultPercent={resultPercent}

                            takeScreenShot={takeScreenShot}
                            /> 
                        </CenteredCol>
                        <CenteredCol style={{margin: '1.5rem 0px'}}>
                            {
                                resultStatus !== 'idle' ? null
                                :
                                <Button 
                                type="primary" 
                                onClick={() => submitIndexToFlag()} style={{width: 300, height: 45, borderRadius: 8}}
                                disabled={resultStatus !== 'idle'}
                                >
                                    {t("PLAYPAGE_SUBMIT")}
                                </Button>
                            }
                        </CenteredCol>
                        <Element name="scroll-to-element" />
                    </Col>
                </Row>
            </CenteredRow>
        </>
    )
}

export async function getServerSideProps({ params, req }) {
    // console.log(req.language)

    let url = `${serverUrl}/api/bingos/${params.bingoId}`
    // console.log(url)

    const res = await fetch(url)
    const data = await res.json()

    return { props: { data } }
}