import React, { createContext, useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/router'
import { serverUrl } from '../lib/serverUrl'
import { useTranslation } from '../i18n'

export const InitialContents = createContext({ //타입 표기, 최하단에 value 전달필요
    categoryList: [],
    bingoList: [],
    bingoPage: 0,
    bingoLoading: true,
    fetchMainBingos: (page: number) => {},
})

const InitialContentsProvider = (props) => {
    const { t, i18n } = useTranslation();
    
    const [ categoryList, setCategoryList ] = useState([])
    const [ bingoList, setBingoList ] = useState([])
    const [ bingoPage, setBingoPage ] = useState(1)
    const [ bingoLoading, setBingoLoading ] = useState(true)

    async function fetchMainCategories() {
        let url = `${serverUrl}/api/categories?lang=${i18n.language}`

        const res = await fetch(url)
        const data = await res.json()
        setCategoryList(data.categories)
    }

    useEffect(() => {
        fetchMainCategories()
        fetchMainBingos(1)
    }, [])

    const fetchMainBingos = useCallback( async (page) => {
        setBingoLoading(true)
        let url = `${serverUrl}/api/bingos?lang=${i18n.language}&page=${bingoPage}&limit=9`

        const res = await fetch(url)
        const data = await res.json()

        if(page === 1){
            setBingoList(data.bingos)
            setBingoPage(bingoPage + 1)
            setBingoLoading(false)
        } else {
            setBingoList([...bingoList, ...data.bingos])
            setBingoPage(bingoPage + 1)
            setBingoLoading(false)
        }
    },[bingoList, bingoPage]) 

    return (
        <InitialContents.Provider value={{ 
            categoryList: categoryList,
            bingoList: bingoList,
            bingoPage: bingoPage,
            bingoLoading: bingoLoading,
            fetchMainBingos: fetchMainBingos
        }}>
            {props.children}
        </InitialContents.Provider>
    ) 
}

export default InitialContentsProvider