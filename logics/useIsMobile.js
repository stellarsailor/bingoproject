import React, { useEffect, useState } from 'react'
import useWindowSize from './useWindowSize'

export default function useIsMobile() {
    const [ isMobile, setIsMobile ] = useState(false)

    const [ width, height ] = useWindowSize()

    useEffect(() => {
        if(width < 600) setIsMobile(true)
        else setIsMobile(false)
    },[width])
    
    return isMobile;
}