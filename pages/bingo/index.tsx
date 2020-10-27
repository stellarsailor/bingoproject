import React, { useState, useEffect, useCallback, useContext } from 'react'
import styled from 'styled-components'
import { Row, Col, BackTop, Radio } from 'antd';
import Sticky from 'react-sticky-el';

import { Link, useTranslation } from '../../i18n';
import { useRouter } from 'next/router';
import BingoListContainer from '../../components/BingoListContainer';
import { CenteredCol } from '../../components/sub/styled';
import useIsMobile from '../../logics/useIsMobile';
import { InitialContents } from '../../store/InitialContentsProvider'

const FilteringTab = styled.div`
    margin-top: ${(props) => props.isMobile ? '4px' : '8px'};
`

export default function List({ }) {
    const { t, i18n } = useTranslation()
    const { sortBy, setSortBy, period, setPeriod, setSearchBy, fetchMainBingos, searchTarget, setSearchTarget } = useContext(InitialContents)
    const router = useRouter()
    const isMobile = useIsMobile()

    useEffect(() => {
        let searchQueryString = router.query.search.toString()
        setSearchBy(searchQueryString)
        setSearchTarget('title')
    },[router.query.search])

    return(
        <>
            <Row style={{display: 'flex'}}>
                <BackTop />
                    <Col xs={24} sm={8} md={8} lg={8} xl={8} style={{paddingRight: isMobile ? 0 : 8, zIndex: 100}}>
                        <Sticky topOffset={0}>
                            <CenteredCol>
                                <div style={{width: '100%', marginBottom: 8, padding: 8, backgroundColor: 'white', border: '1px solid lightgray'}}>
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
                                            <Radio.Button value="all" onClick={() => setPeriod('all')}>
                                                {t("SEARCH_ALLTIME")}
                                            </Radio.Button>
                                            <Radio.Button value="month" onClick={() => setPeriod('month')}>
                                                {t("SEARCH_MONTH")}
                                            </Radio.Button>
                                            <Radio.Button value="week" onClick={() => setPeriod('week')}>
                                                {t("SEARCH_WEEK")}
                                            </Radio.Button>
                                            <Radio.Button value="today" onClick={() => setPeriod('today')}>
                                                {t("SEARCH_TODAY")}
                                            </Radio.Button>
                                        </Radio.Group>
                                    </FilteringTab>
                                    <FilteringTab>
                                        {/* <TabLeftTitle>
                                            Search Target
                                        </TabLeftTitle> */}
                                        <Radio.Group defaultValue={'title'} size="small">
                                            <Radio.Button value="title" onClick={() => setSearchTarget('title')}>
                                                {t("SEARCH_TITLE")}
                                            </Radio.Button>
                                            <Radio.Button value="elements" onClick={() => setSearchTarget('elements')}>
                                                {t("SEARCH_ELEMENTS")}
                                            </Radio.Button>
                                            {/* <Radio.Button value="author" onClick={() => setSearchTarget('author')}>
                                                {t("SEARCH_AUTHOR")}
                                            </Radio.Button> */}
                                        </Radio.Group>
                                    </FilteringTab>

                                    {/* <Checkbox onChange={e => console.log(e.target.value)}>언어 무관</Checkbox> */}
                                </div>
                            </CenteredCol>
                        </Sticky>
                    </Col>
                <Col xs={24} sm={16} md={16} lg={16} xl={16}>
                    <BingoListContainer />
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