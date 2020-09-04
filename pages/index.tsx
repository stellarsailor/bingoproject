import styled from 'styled-components';
import { Menu, Row, Col, BackTop } from 'antd';
import { Link, useTranslation } from '../i18n'
import { useEffect, useState, useContext, useCallback } from 'react';
import Sticky from 'react-sticky-el';
import InfiniteScroll from 'react-infinite-scroll-component';

import { InitialContents } from '../store/InitialContentsProvider'

import { ArrowRightOutlined, PlusOutlined, FireOutlined, ThunderboltOutlined, FireFilled, ThunderboltFilled, MoreOutlined, RedoOutlined, LikeOutlined, BarChartOutlined } from '@ant-design/icons';
import { serverUrl } from '../lib/serverUrl';
import { CenteredRow, CenteredCol } from '../components/sub/styled'
import pickTextColorBasedOnBgColor from '../logics/pickTextColorBasedOnBgColor';
import numberToK from '../logics/numberToK'
import BingoListContainer from '../components/BingoListContainer';
import useIsMobile from '../logics/useIsMobile';

const CategoryRenderer = styled.div`
    display: flex;
    align-items: center;
    background-color: ${props => props.selected? 'white' : 'white'};
    border-left: ${props => !props.color ? `5px solid black` : `5px solid ${props.color}`};
    border-bottom: 1px solid lightgray;
    padding: 0.5rem;
    color: ${props => props.selected ? 'dodgerblue' : 'gray' };
    /* font-weight: ${props => props.selected? 'bold' : null} */
    :hover {
        background-color: var(--mono-1);
        color: ${props => props.selected ? 'dodgerblue' : 'var(--mono-7)' };
    }
`

const FilterButton = styled.div`
    border-radius: 20px;
    background-color: ${props => props.selected ? 'var(--mono-1)' : 'white' };
    height: 32px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0px 16px;
    margin-left: 1rem;
    font-weight: bold;
    color: ${props => props.selected ? 'dodgerblue' : 'gray' };
    :hover {
        background-color: var(--mono-2);
        color: ${props => props.selected ? 'dodgerblue' : 'var(--mono-7)' };
    }
`

const RefreshButton = styled(RedoOutlined)`
    color: gray;
    border-radius: 5px;
    font-size: 1.4rem;
    margin-right: 1rem;
    background-color: white;
    padding: 5px;
    :hover {
        background-color: var(--mono-2);
        color: var(--mono-7);
    }
`

const MobileCategoryContainer = styled.div`
    border: 1px solid lightgray;
    border-bottom: 0px;
    margin-bottom: 1rem;
`

const CreateBingoButton = styled.div`
    width: 100%;
    margin-top: 58px;
    height: 50px;
    background-color: white;
    border: 1px solid lightgray;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.1rem;
    color: rgba(0, 0, 0, 0.65);
    :hover {
        background-color: var(--mono-1);
        transition: 0.2s;
        transition-timing-function: ease-in;
        color: dodgerblue;
    }
`

const GrayLittleLink = styled.a`
    color: var(--mono-4);
    margin-right: 10px;
`

export default function Home({ }) {
    const { t, i18n } = useTranslation()
    const { bingoList, bingoPage, bingoLoading, fetchMainBingos, categoryList } = useContext(InitialContents)
    const isMobile = useIsMobile()
    
    const [ selectedCategory, setSelectedCategory ] = useState(0)
    const [ sortBy, setSortBy ] = useState(0)

    const [ mobileCategoryListVisible, setMobileCategoryListVisible ] = useState(false)

    useEffect(() => {
        fetchMainBingos(selectedCategory, sortBy, '' , 'all', 'all', 1)
    },[selectedCategory, sortBy])

    // const endOfScroll = () => { //context받은거 사용할땐 절대 useCallback 쓰지않기
    //     fetchMainBingos(selectedCategory, bingoPage) //bingoPage는 다음에 fetch할 페이지를 가르킴
    // }

    return (
        <>
            <Row style={{display: 'flex'}}>
                <BackTop />
                <Col xs={24} sm={16} md={16} lg={16} xl={16}>
                    <div style={{width: '100%', marginTop: 58, height: 50, marginBottom: 8, backgroundColor: 'white', border: '1px solid lightgray', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                        <CenteredRow>
                            <a onClick={() => setSortBy(0)}>
                                <FilterButton selected={sortBy === 0}>
                                    <FireFilled style={{marginRight: 5}} />{t("FILTER_BEST")}
                                </FilterButton>
                            </a>
                            <a onClick={() => setSortBy(1)}>
                                <FilterButton selected={sortBy === 1}>
                                    <ThunderboltFilled style={{marginRight: 5}} />{t("FILTER_RECENT")}
                                </FilterButton>
                            </a>
                        {/* <Button onClick={() => endOfScroll()}>next</Button> */}

                        </CenteredRow>
                        <CenteredRow>
                            <RefreshButton onClick={() => fetchMainBingos(selectedCategory, sortBy, '' , 'all', 'all', 1)} />
                            {
                                isMobile ?
                                <MoreOutlined onClick={() => setMobileCategoryListVisible(mobileCategoryListVisible ? false : true)} style={{fontSize: '1.4rem', marginRight: '1rem'}} />
                                : null
                            }
                        </CenteredRow>
                    </div>
                    {
                        mobileCategoryListVisible ?
                        <Row>
                            <Col xs={24} sm={0} md={0} lg={0} xl={0}>
                                <MobileCategoryContainer>
                                    {categoryList.map(v => (
                                        <a key={v.id} onClick={() => { setSelectedCategory(v.id); setMobileCategoryListVisible(false) }}>
                                            <CategoryRenderer color={v.color} selected={selectedCategory === v.id}>
                                                {v[`name_${i18n.language}`]}
                                            </CategoryRenderer>
                                        </a>
                                    ))}
                                </MobileCategoryContainer>
                            </Col>
                        </Row>
                        :
                        null
                    }
                    <BingoListContainer bingoLoading={bingoLoading} bingoList={bingoList} />
                </Col>
                <Col xs={0} sm={8} md={8} lg={8} xl={8} style={{paddingLeft: 8}}>
                    <Sticky >
                        <CenteredCol>
                            <Link href="/bingo/create">
                                <a style={{width: '100%'}}>
                                    <CreateBingoButton>
                                        <CenteredRow style={{padding: 10}}>
                                            <div style={{margin: '0px 1rem'}}>
                                                {t("CREATE_SELFBINGO")}
                                            </div>
                                            <ArrowRightOutlined />
                                        </CenteredRow>
                                    </CreateBingoButton>
                                </a>
                            </Link>
                            <div style={{width: '100%', border: '1px solid lightgray', borderBottom: '0px', marginTop: 8 }}>
                                {
                                    categoryList.length === 0 ? null :
                                    <>
                                        {categoryList.map(v => (
                                            <a key={v.id} onClick={() => setSelectedCategory(v.id)}>
                                                <CategoryRenderer selected={selectedCategory === v.id} color={v.color}>
                                                    {v[`name_${i18n.language}`]}
                                                </CategoryRenderer>
                                            </a>
                                        ))}
                                    </>
                                }
                            </div>
                        </CenteredCol>
                        <div style={{color: 'gray', fontSize: '0.8rem', padding: '10px'}}>
                            <Link href="/about">
                                <GrayLittleLink>
                                    소개
                                </GrayLittleLink>
                            </Link>
                            <Link href="/privacy">
                                <GrayLittleLink>
                                개인정보처리방침
                                </GrayLittleLink>
                            </Link>
                            <p>
                                © 2020 SelfBingo
                            </p>
                        </div>
                    </Sticky>
                </Col>
            </Row>
        </>
    )
}