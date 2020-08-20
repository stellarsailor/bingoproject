import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import styled from 'styled-components'
import { Row, Col, BackTop } from 'antd';

import { serverUrl } from '../../lib/serverUrl'
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function list({ data }) {

    const [ bingoList, setBingoList ] = useState(data.bingos)

    return(
        <>
            <Navbar />
                <div style={{width: '100%', height: 'auto', backgroundImage: `url('/images/official-silhouette-background.jpg')`,
                backgroundRepeat: 'no-repeat', backgroundAttachment: 'fixed'}}>
                    여긴 리스트 쭉 보여주고
                    검색 가능하고
                    {bingoList.map(v => {
                        return (
                            <div>
                                <Link href={`/bingo/${v.id}`}><a>{v.title} / {v.size} {v.author}</a></Link>
                            </div>
                        )
                    })}
                </div>
            <Footer />
        </>
    )
}


export async function getServerSideProps({ req, query }) {

    // const protocol = req ? `${req.headers['x-forwarded-proto']}:` : location.protocol
    // const host = req ? req.headers['x-forwarded-host'] : location.host

    const res = await fetch(`${serverUrl}/api/bingos`)
    const data = await res.json()
  
    return { props: { data } }
}