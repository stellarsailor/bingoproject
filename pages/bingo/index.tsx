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
import useIsMobile from '../../logics/useIsMobile';

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
    // const { bingoLoading, bingoList, fetchMainBingos } = useContext(InitialContents)
    const router = useRouter()
    const isMobile = useIsMobile()

    const [ sortBy, setSortBy ] = useState(0)
    const [ period, setPeriod ] = useState('all')
    const [ searchTarget, setSearchTarget ] = useState('title')

    const [ bingoList, setBingoList ] = useState([])
    const [ bingoLoading, setBingoLoading ] = useState(true)
    const [ bingoPage, setBingoPage ] = useState(1)

    useEffect(() => {
        fetchMainBingos(0, sortBy, router.query.search.toString(), searchTarget, period, 1)
    },[sortBy, router.query.search, period, searchTarget])

    const fetchMainBingos = useCallback( async (categoryId, sortBy, searchBy, searchTarget, period, page) => {
        setBingoLoading(true)

        let url = `${serverUrl}/api/bingos?lang=${i18n.language}`

        url += `&category=${categoryId}`

        url += `&sortBy=${sortBy}`

        if(searchBy === '') url += ''
        else {
            let searchByChunks = searchBy.split(' ')
            searchByChunks.map(v => url += `&searchBy=${v}`)
        }

        if(period === 'all') url += ''
        else if(period === 'month') url += '&period=month'
        else if(period === 'week') url += '&period=week'
        else if(period === 'today') url += '&period=today'
        else url += ''
        
        if(searchTarget === 'all') url += ''
        else if(searchTarget === 'title') url += '&searchTarget=title'
        else if(searchTarget === 'elements') url += '&searchTarget=elements'
        else if(searchTarget === 'author') url += '&searchTarget=author'
        else url += ''

        url += `&page=${bingoPage}&limit=9`

        const res = await fetch(url)
        const data = await res.json()

        if(page === 1){
            setBingoList(data.bingos)
            // setBingoPage(bingoPage + 1)
            setBingoLoading(false)
        } else {
            setBingoList([...bingoList, ...data.bingos])
            // setBingoPage(bingoPage + 1)
            setBingoLoading(false)
        }
    },[bingoList, bingoPage]) 

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
                                        <span style={{color: 'gray'}}> | Search Result</span>
                                    </div>

                                    <FilteringTab>
                                        {/* <TabLeftTitle>
                                            Sort By
                                        </TabLeftTitle> */}
                                        <Radio.Group defaultValue={sortBy} size="small">
                                            <Radio.Button value={0} onClick={() => setSortBy(0)}>{t("FILTER_BEST")}</Radio.Button>
                                            <Radio.Button value={1} onClick={() => setSortBy(1)}>{t("FILTER_RECENT")}</Radio.Button>
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