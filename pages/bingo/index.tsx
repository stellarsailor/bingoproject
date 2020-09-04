import React, { useState, useEffect, useCallback, useContext } from 'react'
import styled from 'styled-components'
import { Row, Col, BackTop, Radio, Button, Checkbox } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons'
import Sticky from 'react-sticky-el';

import { InitialContents } from '../../store/InitialContentsProvider'

import { serverUrl } from '../../lib/serverUrl'
import { Link, useTranslation } from '../../i18n';
import { useRouter } from 'next/router';
import BingoListContainer from '../../components/BingoListContainer';
import { CenteredCol } from '../../components/sub/styled';

const FilteringTab = styled.div`
    margin-top: ${(props) => props.isMobile ? '4px' : '8px'};
`

const TabLeftTitle = styled.div`
    color: lightgray;
    font-weight: bold;
    margin-right: 8px;
`

export default function List({ }) {
    const { t, i18n } = useTranslation()
    const { bingoLoading, bingoList, fetchMainBingos } = useContext(InitialContents)
    const router = useRouter()

    const [ sortBy, setSortBy ] = useState(0)
    const [ period, setPeriod ] = useState('all')
    const [ searchTarget, setSearchTarget ] = useState('title')

    useEffect(() => {
        // console.log(router.query.search)
        fetchMainBingos(0, sortBy, router.query.search.toString(), searchTarget, period, 1)
    },[sortBy, router.query.search, period, searchTarget])

    const [ isMobile, setIsMobile ] = useState(false)
    
    useEffect(() => {
        if(window.innerWidth < 600) setIsMobile(true)
        else setIsMobile(false)
    },[])

    return(
        <>
            <Row style={{display: 'flex'}}>
                <BackTop />
                    <Col xs={24} sm={8} md={8} lg={8} xl={8} style={{paddingRight: isMobile ? 0 : 8, zIndex: 100}}>
                        <Sticky topOffset={0}>
                            <CenteredCol>
                                <div style={{width: '100%', marginTop: isMobile ? 50 : 58, marginBottom: 8, padding: 8, backgroundColor: 'white', border: '1px solid lightgray'}}>
                                    <div>
                                        <span style={{fontWeight: 'bold', fontSize: '1rem', marginRight: 8}}>{router.query.search}</span> 
                                        <span style={{color: 'gray'}}>Search Result</span>
                                    </div>

                                    <FilteringTab>
                                        {/* <TabLeftTitle>
                                            Sort By
                                        </TabLeftTitle> */}
                                        <Radio.Group defaultValue={sortBy} size="small">
                                            <Radio.Button value={0} onClick={() => setSortBy(0)}>인기도 순</Radio.Button>
                                            <Radio.Button value={1} onClick={() => setSortBy(1)}>최신 순</Radio.Button>
                                        </Radio.Group>
                                    </FilteringTab>
                                    <FilteringTab>
                                        {/* <TabLeftTitle>
                                            Period
                                        </TabLeftTitle> */}
                                        <Radio.Group defaultValue={period} size="small">
                                            <Radio.Button value="all" onClick={() => setPeriod('all')}>전체</Radio.Button>
                                            <Radio.Button value="month" onClick={() => setPeriod('month')}>이번달</Radio.Button>
                                            <Radio.Button value="week" onClick={() => setPeriod('week')}>이번주</Radio.Button>
                                            <Radio.Button value="today" onClick={() => setPeriod('today')}>오늘</Radio.Button>
                                        </Radio.Group>
                                    </FilteringTab>
                                    <FilteringTab>
                                        {/* <TabLeftTitle>
                                            Search Target
                                        </TabLeftTitle> */}
                                        <Radio.Group defaultValue={searchTarget} size="small">
                                            <Radio.Button value="title" onClick={() => setSearchTarget('title')}>제목</Radio.Button>
                                            <Radio.Button value="elements" onClick={() => setSearchTarget('elements')}>빙고</Radio.Button>
                                            <Radio.Button value="author" onClick={() => setSearchTarget('author')}>작성자</Radio.Button>
                                        </Radio.Group>
                                    </FilteringTab>

                                    {/* <Checkbox onChange={e => console.log(e.target.value)}>언어 무관</Checkbox> */}
                                </div>
                            </CenteredCol>
                        </Sticky>
                    </Col>
                <Col xs={24} sm={16} md={16} lg={16} xl={16} style={{marginTop: isMobile ? 0 : 58}}>
                    <BingoListContainer bingoLoading={bingoLoading} bingoList={bingoList} />
                </Col>
            </Row>
        </>
    )
}

// export async function getServerSideProps({ req }) {
//     console.log(req.language)

//     // const protocol = req ? `${req.headers['x-forwarded-proto']}:` : location.protocol
//     // const host = req ? req.headers['x-forwarded-host'] : location.host

//     const res = await fetch(`${serverUrl}/api/bingos`)
//     const data = await res.json()
  
//     return { props: { data } }
// }