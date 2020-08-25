import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/router'
import styled from 'styled-components'
import { Row, Col, BackTop, Button } from 'antd';
import { Link, useTranslation } from '../../i18n';
import domtoimage from 'dom-to-image';

import { serverUrl } from '../../lib/serverUrl';
import BingoRenderer from '../../components/BingoRenderer';
import { CenteredCol } from '../../components/sub/styled';
import { ArrowLeftOutlined, LikeOutlined, DislikeOutlined, AlertOutlined, CameraOutlined, ShareAltOutlined } from '@ant-design/icons';

const ControllerPage = styled.div`
    background-color: white;
    border: 1px solid lightgray;
`

export default function BingoDetail({ data }) {
    // const router = useRouter()
    // const { bingoId } = router.query
    const { t, i18n } = useTranslation();

    const [ bingo, setBingo ] = useState(data.bingo)

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

    return(
        <>
            <Row>
            <Col xs={24} sm={8} md={8} lg={8} xl={8} style={{marginTop: '1rem', paddingRight: '1rem'}}>
                <ControllerPage>
                    <div style={{width: '100%', backgroundColor: 'white', padding: '1rem'}}>
                        <Link href="/">
                            <a>
                                <ArrowLeftOutlined /> Back To List
                            </a>
                        </Link>
                    </div>
                    <div style={{padding: '1rem', fontSize: '1rem'}}>
                        <div>
                            {bingo.title} - {bingo.author}({bingo.ipAddress})
                        </div>
                        <div>
                            <LikeOutlined /> <DislikeOutlined />
                        </div>
                        <div>
                            <AlertOutlined />
                        </div>
                        <div>
                            빙고 마크 표시 모양 설정
                        </div>
                        <div>
                            <ShareAltOutlined />링크 공유
                        </div>
                        <CenteredCol>
                            <Button onClick={takeScreenShot}>
                                <CameraOutlined />캡쳐 버튼
                            </Button>
                            <Button type="primary" onClick={() => console.log('submit')} style={{width: '50%'}}>통계 확인</Button>
                        </CenteredCol>
                    </div>

                </ControllerPage>
            </Col>
            <Col xs={24} sm={16} md={16} lg={16} xl={16} id="nodenode">
                {/* <Checkbox onChange={e => console.log(e)}>NSFW</Checkbox> */}
                <BingoRenderer 
                title={bingo.title}
                author={'asd'}
                size={bingo.size}
                elements={JSON.parse(bingo.elements)}
                elementOnClickEvent={(i) => console.log(i)}
                bgMainColor={bingo.bgMainColor}
                bgSubColor={bingo.bgSubColor}
                fontColor={bingo.fontColor}
                cellColor={bingo.cellColor}
                lineColor={bingo.lineColor}
                linePixel={bingo.linePixel}
                />
                
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