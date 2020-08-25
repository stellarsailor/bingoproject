import styled from 'styled-components';
import { Menu, Row, Col, Input, Button, Radio } from 'antd';
import { Link, useTranslation } from '../i18n'
import { useEffect, useState, useContext } from 'react';
import Sticky from 'react-sticky-el';

import { InitialContents } from '../store/InitialContentsProvider'

import { ArrowRightOutlined, PlusOutlined, FireOutlined, ThunderboltOutlined, FireFilled, ThunderboltFilled, MoreOutlined, RedoOutlined, LikeOutlined } from '@ant-design/icons';
import { serverUrl } from '../lib/serverUrl';
import { CenteredRow, CenteredCol } from '../components/sub/styled'
import pickTextColorBasedOnBgColor from '../logics/pickTextColorBasedOnBgColor';

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
    height: 35px;
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

const BingoPane = styled.div`
    border-bottom: 1px solid var(--mono-2);
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
    padding: 10px;
    :hover {
        background-color: var(--mono-1);
        transition: 0.2s;
        transition-timing-function: ease-in;
    }
`

const BingoPaneText = styled.div`
    display: flex;
    flex-direction: column; 
    color: var(--mono-5);
    overflow: hidden;
`

const SquareBingoIcon = styled.div`
    color: ${props => props.fontColor};
    /* background: ${props => `-webkit-linear-gradient(${props.bgMainColor}, ${props.bgSubColor})`}; */
    background-color: ${props => props.bgMainColor};
    border: 1px solid var(--mono-2);
    width: 80px;
    min-width: 80px;
    height: 80px;
    font-size: 1.6rem;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 1rem;
`

const CreateBingoButton = styled.div`
    width: 100%;
    margin-top: 66px;
    height: 60px;
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
    const { t, i18n } = useTranslation();
    const { bingoList, categoryList, refreshInitialContents } = useContext(InitialContents)

    const [ selectedCategory, setSelectedCategory ] = useState(0)

    const [ isMobile, setIsMobile ] = useState(false)
    const [ mobileCategoryListVisible, setMobileCategoryListVisible ] = useState(false)

    useEffect(() => {
        if(window.innerWidth < 600) setIsMobile(true)
        else setIsMobile(false)
    },[])

    return (
        <>
            <Row style={{display: 'flex'}} gutter={16}>
                <Col xs={24} sm={16} md={16} lg={16} xl={16}>
                    <div style={{width: '100%', marginTop: 66, height: 60, marginBottom: '1rem', backgroundColor: 'white', border: '1px solid lightgray', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                        <CenteredRow>
                            <a>
                                <FilterButton selected={true}>
                                    <FireFilled style={{marginRight: 5}} />Best
                                </FilterButton>
                            </a>
                            <a>
                                <FilterButton selected={false}>
                                    <ThunderboltFilled style={{marginRight: 5}} />최신 순
                                </FilterButton>
                            </a>
                        </CenteredRow>
                        <CenteredRow>
                            <RefreshButton onClick={() => refreshInitialContents()} />
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
                    <div style={{width: '100%', height: 2000, backgroundColor: 'white', border: '1px solid lightgray'}}>
                        {
                            bingoList.length === 0 ? 
                            <div>loading</div> 
                            :
                            bingoList.filter(v => selectedCategory === 0 ? true : v.categoryId === selectedCategory).map(v => (
                                <Link href={`/bingo/${v.id}`} key={v.id} ><a>
                                    <BingoPane>
                                        <SquareBingoIcon bgMainColor={v.bgMainColor} bgSubColor={v.bgSubColor} fontColor={pickTextColorBasedOnBgColor(v.bgMainColor, '#ffffff','#000000')}>
                                            {v.size} X {v.size}
                                        </SquareBingoIcon>
                                        <BingoPaneText>
                                            <div>
                                                <span style={{fontWeight: 'bold', fontSize: '1rem', marginRight: '1rem'}}>
                                                    {v.title} <span style={{color: 'dodgerblue', marginLeft: 10}}><LikeOutlined /> 4k</span>
                                                </span>
                                            </div> 
                                            <span style={{color: 'var(--mono-4)'}}>{v.author}({v.ipAddress}) 4 days ago</span>
                                            <div style={{overflow: 'hidden', color: 'var(--mono-4)'}}>
                                                {JSON.parse(v.elements).sort(() => Math.random() - Math.random()).slice(0, 3).map((v, index) => 
                                                    <span key={index}> #{v} </span> )}
                                            </div>
                                        </BingoPaneText>
                                    </BingoPane>
                                </a></Link>
                            ))
                        }
                    </div>
                </Col>
                <Col xs={0} sm={8} md={8} lg={8} xl={8}>
                    <Sticky >
                        <CenteredCol>
                            <Link href="/bingo/create">
                                <a style={{width: '100%'}}>
                                    <CreateBingoButton>
                                        <CenteredRow style={{padding: 10}}>
                                            <div style={{margin: '0px 1rem'}}>
                                                셀프빙고 만들기
                                            </div>
                                            <ArrowRightOutlined />
                                        </CenteredRow>
                                    </CreateBingoButton>
                                </a>
                            </Link>
                            <div style={{width: '100%', border: '1px solid lightgray', borderBottom: '0px', marginTop: '1rem' }}>
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