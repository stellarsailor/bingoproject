import styled from 'styled-components'
import Modal from 'antd/lib/modal/Modal'
import { useState, useCallback, useEffect, useRef } from 'react'
import { Input, Skeleton, Empty, Button } from 'antd'
import { CenteredRow, CenteredCol } from './sub/styled'
import pickTextColorBasedOnBgColor from '../logics/pickTextColorBasedOnBgColor'
import { Link, useTranslation } from '../i18n'
import { LikeOutlined, BarChartOutlined } from '@ant-design/icons'
import numberToK from '../logics/numberToK'

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
    const { bingoLoading, bingoList } = props

    return (
        <div style={{width: '100%', minHeight: 1200, backgroundColor: 'white', border: '1px solid lightgray'}}>
            {
                bingoLoading ? 
                <>
                <BingoPane>
                    <Skeleton.Avatar active={true} size={80} shape="square" style={{marginRight: '1rem'}} />
                    <Skeleton paragraph={{ rows: 1 }} />
                </BingoPane>
                <BingoPane>
                    <Skeleton.Avatar active={true} size={80} shape="square" style={{marginRight: '1rem'}} />
                    <Skeleton paragraph={{ rows: 1 }} />
                </BingoPane>
                </>
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
                    // <InfiniteScroll
                    // dataLength={bingoList.length} //This is important field to render the next data
                    // next={fetchMainBingos}
                    // hasMore={true}
                    // loader={<h4>Loading...</h4>}
                    // endMessage={
                    //     <p style={{textAlign: 'center'}}>
                    //     <b>Yay! You have seen it all</b>
                    //     </p>
                    // }>
                    <div>
                        {/* { bingoList.filter(v => selectedCategory === 0 ? true : v.categoryId === selectedCategory).map(v => ( */}
                        { bingoList.map(v => (
                            <Link href={`/bingo/${v.id}`} key={v.id} ><a>
                                <BingoPane>
                                    <SquareBingoIcon bgMainColor={v.bgMainColor} bgSubColor={v.bgSubColor} fontColor={pickTextColorBasedOnBgColor(v.bgMainColor, '#ffffff','#000000')}>
                                        {v.size} X {v.size}
                                    </SquareBingoIcon>
                                    <BingoPaneText>
                                        <div>
                                            {/* <div style={{borderLeft: `2px solid ${categoryList.filter(c => c.id === v.categoryId)[0].color}`}}>
                                                <span style={{fontSize: '0.8rem', marginLeft: 5}}>{categoryList.filter(c => c.id === v.categoryId)[0][`name_${i18n.language}`]}</span>
                                            </div> */}
                                            <span style={{fontWeight: 'bold', fontSize: '1rem', marginRight: '1rem'}}>
                                                {v.title} 
                                                <span style={{color: 'dodgerblue', marginLeft: 20, fontSize: 14}}><LikeOutlined /> {numberToK(v.likes)}</span>
                                                <span style={{color: 'dodgerblue', marginLeft: 10, fontSize: 14}}><BarChartOutlined /> {numberToK(15434)}</span>
                                            </span>
                                        </div> 
                                        {/* <span style={{color: 'var(--mono-4)'}}>{v.author}({v.ipAddress}) 4 days ago</span> */}
                                        <div style={{overflow: 'hidden', color: 'var(--mono-4)', fontSize: '0.8rem'}}>
                                            {JSON.parse(v.elements).sort(() => Math.random() - Math.random()).slice(0, 3).map((v, index) => 
                                                <span key={index}> #{v} </span> )}
                                        </div>
                                    </BingoPaneText>
                                </BingoPane>
                            </a></Link>
                        )) }
                    </div>
                    // </InfiniteScroll>
            }
        </div>
    )
}