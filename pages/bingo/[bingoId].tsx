import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/router'
import styled from 'styled-components'
import { Row, Col, BackTop, Button, Spin, Popconfirm, Input, message } from 'antd';
import { Link, useTranslation } from '../../i18n';
import domtoimage from 'dom-to-image';

import { serverUrl } from '../../lib/serverUrl';
import BingoRenderer from '../../components/BingoRenderer';
import { CenteredCol, CenteredRow } from '../../components/sub/styled';
import { ShareAltOutlined, LeftOutlined, LikeFilled, DislikeFilled, AlertFilled, CameraFilled, CheckSquareOutlined, DeleteOutlined, LockOutlined } from '@ant-design/icons';

message.config({
    top: 58,
})

const ControllerPage = styled.div`
    background-color: white;
    border: 1px solid lightgray;
`

const MenuButton = styled.div`
    border-radius: 3px;
    background-color: ${props => props.selected ? 'var(--mono-1)' : 'white' };
    height: 25px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0px 8px;
    margin-left: 1rem;
    color: ${props => props.selected ? 'dodgerblue' : 'gray' };
    :hover {
        background-color: var(--mono-2);
        color: ${props => props.selected ? 'dodgerblue' : 'var(--mono-7)' };
    }
`

export default function BingoDetail({ data }) {
    const router = useRouter()
    const { bingoId } = router.query
    const { t, i18n } = useTranslation()

    const [ passwordInput, setPasswordInput ] = useState('')

    const [ bingo, setBingo ] = useState(data.bingo)
    const [ selectedIndex, setSelectedIndex ] = useState([])
    const [ completedBingoLines, setCompletedBingoLines ] = useState(0) 

    const [ resultStatus, setResultStatus ] = useState('idle')
    const [ resultCount, setResultCount ] = useState([])
    const [ resultPercent, setResultPercent ] = useState([])

    useEffect(() => {
        
    },[])

    const deleteBingo = async (passwordInput) => {
        let url = `${serverUrl}/api/bingos/${bingoId}`
        const settings = {
            method: 'DELETE',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                password: passwordInput
            })
        }
        try {
            const fetchResponse = await fetch(url, settings)
            const data = await fetchResponse.json()

            if(data.results === 'success'){
                router.push('/')
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

    const takeScreenShot = useCallback(() => {
        let node = document.getElementById('nodenode')

        domtoimage.toJpeg(node)
        .then(function (dataUrl) {
            let link = document.createElement('a')
            link.download = `selfbingo.com-${bingo.title}.jpg`
            link.href = dataUrl
            link.click()
        })
    },[])

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
                binaryResult: arr
            })
        }
        try {
            const fetchResponse = await fetch(url, settings)
            const data = await fetchResponse.json()

            setResultStatus('calculating')
            let resultLength = data.results.length
            let bingoLength = bingo.size * bingo.size //JSON.parse(data.results[0].binaryResult.length)

            let countArr = []
            for(let i = 0; i < bingoLength; i++ ){
                countArr.push(0)
            }

            data.results.map((v) => {
                JSON.parse(v.binaryResult).map((v, index) => {
                    if(typeof(v) === 'number') countArr[index] += v
                })
            })

            let percentArr = countArr.map(v => Math.round((v / resultLength) * 100))

            setResultCount(countArr)
            setResultPercent(percentArr)
            setResultStatus('done')
        } catch (e) {
            return e;
        }    
    },[selectedIndex])

    return(
        <>
            <Row style={{paddingTop: 50}} >
                <Col xs={24} sm={24} md={24} lg={24} xl={24} style={{marginTop: 8, marginBottom: 8}}>
                    <ControllerPage>
                        <div style={{width: '100%', paddingTop: '1rem', paddingLeft: '1rem'}}>
                            <Link href="/">
                                <a style={{fontSize: '1.1rem'}}>
                                    <LeftOutlined /> Back
                                </a>
                            </Link>
                        </div>
                        <div style={{paddingBottom: '1rem', fontSize: '1rem'}}>
                            <CenteredRow>
                                <MenuButton>
                                    <span><LikeFilled /> Up</span>
                                </MenuButton>
                                <MenuButton>
                                    <span><DislikeFilled /> Down</span>
                                </MenuButton>
                            </CenteredRow>
                            <CenteredRow>
                                <MenuButton>
                                    <span><CheckSquareOutlined /> Style</span>
                                </MenuButton>
                                <MenuButton>
                                    <span><AlertFilled /> Report</span>
                                </MenuButton>
                                <MenuButton>
                                    <span><ShareAltOutlined /> Share</span>
                                </MenuButton>
                                <MenuButton>
                                    <Popconfirm
                                        title={
                                            <div> 
                                                <Input.Password placeholder="input password" onChange={(e) => setPasswordInput(e.target.value)} style={{width: 200}} />
                                            </div>
                                        }
                                        onConfirm={() => deleteBingo(passwordInput)}
                                        onCancel={() => console.log('cancelled')}
                                        okText="Delete"
                                        cancelText="Cancel"
                                        icon={<LockOutlined style={{fontSize: 20}} />}
                                        placement="bottom"
                                    >
                                        <span><DeleteOutlined /> Delete</span>
                                    </Popconfirm>
                                </MenuButton>
                                <MenuButton onClick={takeScreenShot}>
                                    <span><CameraFilled /> Capture</span>
                                </MenuButton>
                            </CenteredRow>
                        </div>

                    </ControllerPage>
                </Col>
                <Col xs={24} sm={24} md={24} lg={24} xl={24} >
                    {/* <Checkbox onChange={e => console.log(e)}>NSFW</Checkbox> */}
                    <BingoRenderer 
                    id="nodenode"
                    title={bingo.title}
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
                    />
                    <CenteredCol style={{margin: '1rem 0px'}}>
                        현재 빙고갯수 : {completedBingoLines}
                        <Button type="primary" onClick={() => submitIndexToFlag()} style={{width: '50%'}}>제출 및 통계 확인</Button>
                    </CenteredCol>
                    {
                        resultStatus === 'idle' ? null 
                        : resultStatus === 'saving' ? <div><Spin /> 데이터를 저장 중 입니다.</div>
                        : resultStatus === 'calculating' ? <div><Spin /> 데이터를 계산 중 입니다.</div>
                        : 
                        <div>
                            유저들이 선택한 횟수 : {resultCount.toString()}
                            퍼센티지 비율 : {resultPercent.toString()}
                        </div>
                    }
                </Col>
            </Row>
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