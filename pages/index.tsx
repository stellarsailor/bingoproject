import styled from 'styled-components';
import { Menu, Row, Col, Input, Button, Radio } from 'antd';
import { Link, useTranslation } from '../i18n'
import { useEffect, useState } from 'react';

import { ArrowRightOutlined } from '@ant-design/icons';
import { serverUrl } from '../lib/serverUrl';
import MakeBingoButton from '../components/sub/MakeBingoButton';

export default function Home({ }) {
    const { t, i18n } = useTranslation();

    const [ categoryList, setCategoryList ] = useState([])
    const [ bingoList, setBingoList] = useState([])

    useEffect(() => {
        async function fetchMainCategories() {
            let url = `${serverUrl}/api/categories?lang=${i18n.language}`

            const res = await fetch(url)
            const data = await res.json()
            setCategoryList(data.categories)
        }

        async function fetchMainBingos() {
            let url = `${serverUrl}/api/bingos?lang=${i18n.language}`

            const res = await fetch(url)
            const data = await res.json()
            setBingoList(data.bingos)
        }

        fetchMainCategories()
        fetchMainBingos()
    }, []);

    return (
        <>
            <Row style={{paddingTop: '1rem', display: 'flex'}}>
                <Col xs={0} sm={8} md={8} lg={8} xl={8} style={{ paddingRight: '1rem'}}>
                    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', }}>
                        <div style={{ width: '100%', height: 100, backgroundColor: 'lightcyan'}}>
                            <Link href="/bingo/create">
                                <a>
                                    <div>
                                        나만의 만들기
                                    </div>
                                </a>
                            </Link>
                        </div>
                        <div style={{width: '100%', border: '1px solid lightgray', borderBottom: '0px', marginTop: '1rem' }}>
                            {
                                categoryList.length === 0 ? null :
                                <>
                                    <div style={{backgroundColor: 'white', borderLeft: `5px solid black`, borderBottom: '1px solid lightgray', padding: '1rem'}}>
                                        전체 카테고리
                                    </div>
                                    {categoryList.map(v => (
                                        <div key={v.id} style={{backgroundColor: 'white', borderLeft: `5px solid ${v.color}`, borderBottom: '1px solid lightgray', padding: '1rem'}}>
                                            {v[`name_${i18n.language}`]}
                                        </div>
                                    ))}
                                </>
                            }
                        </div>
                    </div>
                    <div style={{color: 'gray', fontSize: '0.8rem'}}>
                        소개 . 개인정보처리방침
                    </div>
                    <div style={{color: 'gray', fontSize: '0.8rem'}}>
                        © 2020 SelfBingo
                    </div>
                </Col>
                <Col xs={24} sm={16} md={16} lg={16} xl={16} >
                    <div style={{width: '100%', height: 60, marginBottom: '1rem', backgroundColor: 'white', border: '1px solid lightgray'}}>
                        <Radio.Group defaultValue="a">
                            <Radio.Button value="a">인기도 순</Radio.Button>
                            <Radio.Button value="b">최신 순</Radio.Button>
                        </Radio.Group>

                    </div>
                    <div style={{width: '100%', height: 900, backgroundColor: 'white', border: '1px solid lightgray'}}>
                        {
                            bingoList.length === 0 ? 
                                <div>loading</div>
                            :
                                bingoList.map(v => (
                                    <Link href={`/bingo/${v.id}`} key={v.id} ><a>
                                        <div style={{borderBottom: '1px solid var(--mono-2)', display: 'flex', flexDirection: 'row', width: '100%'}}>
                                            <div style={{backgroundColor: `lightgreen`, width: 100, height: 100, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                                <span style={{fontSize: '2rem'}}>
                                                    {v.size} X {v.size}
                                                </span>
                                            </div>
                                            <div style={{display: 'flex', flexDirection: 'column'}}>
                                                <div style={{fontWeight: 'bold'}}>{v.title}</div> 
                                                <div>{v.description}</div>
                                            </div>
                                            <div style={{display: 'flex', alignItems: 'center'}}>
                                                <ArrowRightOutlined />
                                            </div>
                                        </div>
                                    </a></Link>
                                ))
                        }
                    </div>
                </Col>
            </Row>
        </>
    )
}