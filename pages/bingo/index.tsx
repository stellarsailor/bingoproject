import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import styled from 'styled-components'
import { Row, Col, BackTop } from 'antd';

import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function list({ data }) {

    const [ sample, setSample ] = useState(data.data)

    // console.log(data.data)

    return(
        <>
            <Navbar />
                <div style={{width: '100%', height: 'auto', backgroundImage: `url('/images/official-silhouette-background.jpg')`,
                backgroundRepeat: 'no-repeat', backgroundAttachment: 'fixed'}}>
                    여긴 리스트 쭉 보여주고
                    검색 가능하고
                    {sample.map(v => v.phrase)}
                </div>
            <Footer />
        </>
    )
}


export async function getServerSideProps() {
    // Fetch data from external API
    const res = await fetch(`https://api.brittea.uk/group/select?page=1`)
    const data = await res.json()
  
    // Pass data to the page via props
    return { props: { data } }
}