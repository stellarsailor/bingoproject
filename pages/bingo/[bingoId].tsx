import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/router'
import styled from 'styled-components'
import { Row, Col, BackTop, Button } from 'antd';
import { Link, useTranslation } from '../../i18n';
import domtoimage from 'dom-to-image';

import { serverUrl } from '../../lib/serverUrl';
import BingoRenderer from '../../components/BingoRenderer';
import { CenteredCol, CenteredRow } from '../../components/sub/styled';
import { ArrowLeftOutlined, LikeOutlined, DislikeOutlined, AlertOutlined, CameraOutlined, ShareAltOutlined, LeftOutlined, LikeFilled, DislikeFilled, AlertFilled, CameraFilled, CheckSquareOutlined } from '@ant-design/icons';

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
    // const router = useRouter()
    // const { bingoId } = router.query
    const { t, i18n } = useTranslation();

    const [ bingo, setBingo ] = useState(data.bingo)
    const [ selectedIndex, setSelectedIndex ] = useState([])
    const [ completedBingoLines, setCompletedBingoLines ] = useState(0) 

    useEffect(() => {
        
    },[])

    const takeScreenShot = useCallback(() => {
        let node = document.getElementById('nodenode');

        domtoimage.toJpeg(node)
        .then(function (dataUrl) {
            let link = document.createElement('a');
            link.download = `selfbingo.com-${bingo.title}.jpg`;
            link.href = dataUrl;
            link.click();
        });
    },[])

    const addIndexToSelected = useCallback((indexToPushPop) => {
        let nextIndexArray = []
        nextIndexArray = selectedIndex.includes(indexToPushPop) ? selectedIndex.filter(t => t !== indexToPushPop) : [...selectedIndex, indexToPushPop]
        setSelectedIndex(nextIndexArray);
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
                                    <LikeFilled /> Up
                                </MenuButton>
                                <MenuButton>
                                    <DislikeFilled /> Down
                                </MenuButton>
                            </CenteredRow>
                            <CenteredRow>
                                <MenuButton>
                                    <CheckSquareOutlined /> Style
                                </MenuButton>
                                <MenuButton>
                                    <AlertFilled /> Report
                                </MenuButton>
                                <MenuButton>
                                    <ShareAltOutlined /> Share
                                </MenuButton>
                                <MenuButton onClick={takeScreenShot}>
                                    <CameraFilled /> Capture
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
                        <Button type="primary" onClick={() => console.log('submit')} style={{width: '50%'}}>제출 및 통계 확인</Button>
                    </CenteredCol>
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