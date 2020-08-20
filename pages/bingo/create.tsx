import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import styled from 'styled-components'
import { Row, Col, BackTop } from 'antd';

import { serverUrl } from '../../lib/serverUrl'
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function list({ data }) {

    return(
        <>
            <Navbar />
                <div>
                    빙고 생성하는 페이지
                </div>
            <Footer />
        </>
    )
}