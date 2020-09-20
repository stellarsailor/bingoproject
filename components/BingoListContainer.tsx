import styled from 'styled-components'
import Modal from 'antd/lib/modal/Modal'
import { useState, useCallback, useEffect, useRef, useContext } from 'react'
import { Input, Skeleton, Empty, Button } from 'antd'
import { CenteredRow, CenteredCol } from './sub/styled'
import pickTextColorBasedOnBgColor from '../logics/pickTextColorBasedOnBgColor'
import { Link, useTranslation } from '../i18n'
import { LikeOutlined, BarChartOutlined } from '@ant-design/icons'
import numberToK from '../logics/numberToK'
import InfiniteScroll from 'react-infinite-scroll-component'
import { InitialContents } from '../store/InitialContentsProvider'

const BingoPane = styled.div`
    border-bottom: 1px solid var(--mono-2);
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
    padding: 8px;
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
    font-weight: bold;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 1rem;
`

export default function BingoListContainer( props ){
    const { t, i18n } = useTranslation()
    const { selectedCategory, sortBy } = props
    const { bingoList, bingoPage, bingoLoading, bingoHasMore, fetchMainBingos, categoryList } = useContext(InitialContents)

    const skeletonGroup = () => (
        <div style={{width: '100%'}}>
            <BingoPane>
                <Skeleton.Avatar active={true} size={80} shape="square" style={{marginRight: '1rem'}} />
                <Skeleton paragraph={{ rows: 1 }} />
            </BingoPane>
            <BingoPane>
                <Skeleton.Avatar active={true} size={80} shape="square" style={{marginRight: '1rem'}} />
                <Skeleton paragraph={{ rows: 1 }} />
            </BingoPane>
            <BingoPane>
                <Skeleton.Avatar active={true} size={80} shape="square" style={{marginRight: '1rem'}} />
                <Skeleton paragraph={{ rows: 1 }} />
            </BingoPane>
        </div>
    )

    const endMessage = () => (
        <p style={{textAlign: 'center', marginTop: 16, color: 'lightgray'}}>
            <b>더 이상 불러올 빙고가 없습니다.</b>
        </p>
    )

    return (
        <div style={{width: '100%', minHeight: 1200, backgroundColor: 'white', border: '1px solid lightgray'}}>
            {
                bingoLoading ? 
                skeletonGroup()
                :
                    bingoList.length === 0 ?
                    <Empty 
                    image={Empty.PRESENTED_IMAGE_SIMPLE} 
                    description={
                        <span>Empty</span>
                    }>
                        <Link href="/bingo/create">
                            <a>
                                <Button type="primary" style={{margin: '8px 0px'}}>
                                    {t("CREATE_SELFBINGO")}
                                </Button>
                            </a>
                        </Link>
                        <div>{t("EMPTY_TRY_OTHER")}</div>
                    </Empty>
                    :
                    <InfiniteScroll
                    dataLength={bingoList.length} //This is important field to render the next data
                    next={() => fetchMainBingos(bingoPage)}
                    hasMore={bingoHasMore}
                    loader={skeletonGroup()}
                    endMessage={endMessage()}
                    >
                        { bingoList.map( (v, index) => (
                            <Link href={`/bingo/${v.id}`} key={index} ><a>
                                <BingoPane>
                                    <SquareBingoIcon bgMainColor={v.bgMainColor} bgSubColor={v.bgSubColor} fontColor={pickTextColorBasedOnBgColor(v.bgMainColor, '#ffffff','#000000')}>
                                        {v.size} X {v.size}
                                    </SquareBingoIcon>
                                    <BingoPaneText>
                                        <div>
                                            <span style={{fontWeight: 'bold', fontSize: '1rem', marginRight: '1rem'}}>
                                                {v.title} <span style={{color: 'dodgerblue', marginLeft: 10, fontSize: 14}}><BarChartOutlined /> {numberToK(v.popularity)}</span>
                                            </span>
                                        </div> 
                                        <span style={{color: 'var(--mono-4)'}}>{v.description}</span>
                                        <div style={{overflow: 'hidden', color: 'var(--mono-4)', fontSize: '0.8rem'}}>
                                            {JSON.parse(v.elements).sort(() => Math.random() - Math.random()).slice(0, 2).map((v, index) => 
                                                <span key={index}> #{v} </span> )}
                                        </div>
                                    </BingoPaneText>
                                </BingoPane>
                            </a></Link>
                        )) }
                    </InfiniteScroll>
            }
        </div>
    )
}