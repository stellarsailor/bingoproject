import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import styled from 'styled-components'
import { Row, Col, BackTop } from 'antd';

import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function list(props) {

    return(
        <>
            <Navbar />
                <div style={{width: '100%', height: 'auto', backgroundImage: `url('/images/official-silhouette-background.jpg')`,
                backgroundRepeat: 'no-repeat', backgroundAttachment: 'fixed'}}>
                    여긴 리스트 쭉 보여주고
                    검색 가능하고
                </div>
            <Footer />
        </>
    )
}