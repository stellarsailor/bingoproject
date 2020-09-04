import React, { createContext, useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/router'
import { serverUrl } from '../lib/serverUrl'
import { useTranslation } from '../i18n'

export const InitialContents = createContext({ //타입 표기, 최하단에 value 전달필요
    categoryList: [],
    bingoList: [],
    bingoPage: 0,
    bingoLoading: true,
    fetchMainBingos: (categoryId: number, sortBy: number, searchBy: string, searchTarget: string, period: string, page: number) => {},
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
        fetchMainBingos(0, 0, '', 'all', 'all' , 1)
    }, [])

    const fetchMainBingos = useCallback( async (categoryId, sortBy, searchBy, searchTarget, period, page) => {
        setBingoLoading(true)

        let url = `${serverUrl}/api/bingos?lang=${i18n.language}`

        url += `&category=${categoryId}`

        url += `&sortBy=${sortBy}`

        if(searchBy === '') url += ''
        else {
            let searchByChunks = searchBy.split(' ')
            searchByChunks.map(v => url += `&searchBy=${v}`)
        }

        if(period === 'all') url += ''
        else if(period === 'month') url += '&period=month'
        else if(period === 'week') url += '&period=week'
        else if(period === 'today') url += '&period=today'
        else url += ''
        
        if(searchTarget === 'all') url += ''
        else if(searchTarget === 'title') url += '&searchTarget=title'
        else if(searchTarget === 'elements') url += '&searchTarget=elements'
        else if(searchTarget === 'author') url += '&searchTarget=author'
        else url += ''

        url += `&page=${bingoPage}&limit=9`

        const res = await fetch(url)
        const data = await res.json()

        if(page === 1){
            setBingoList(data.bingos)
            // setBingoPage(bingoPage + 1)
            setBingoLoading(false)
        } else {
            setBingoList([...bingoList, ...data.bingos])
            // setBingoPage(bingoPage + 1)
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