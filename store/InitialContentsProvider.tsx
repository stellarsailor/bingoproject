import React, { createContext, useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/router'
import { serverUrl } from '../lib/serverUrl'
import { useTranslation } from '../i18n'

export const InitialContents = createContext({ //타입 표기, 최하단에 value 전달필요
    categoryList: [],
    bingoList: [],
    bingoPage: 1,
    setBingoPage: (pageNumber) => {},
    bingoLoading: true,
    bingoHasMore: true,

    selectedCategory: 0,
    setSelectedCategory: (category: number) => {},
    sortBy: 0,
    setSortBy: (sortBy: 0 | 1) => {},
    searchBy: '',
    setSearchBy: (searchBy: string) => {},
    searchTarget: 'all',
    setSearchTarget: (searchTarget: string) => {},
    period: 'all',
    setPeriod: (period: string) => {},
    fetchMainBingos: (pageParam) => {},
})

const InitialContentsProvider = (props) => {
    const { t, i18n } = useTranslation()
    const router = useRouter()

    
    const [ categoryList, setCategoryList ] = useState([])
    const [ bingoList, setBingoList ] = useState([])
    const [ bingoPage, setBingoPage ] = useState(1)
    const [ bingoLimit, setBingoLimit ] = useState(15)
    const [ bingoLoading, setBingoLoading ] = useState(true)
    const [ bingoHasMore, setBingoHasMore ] = useState(true)

    const [ selectedCategory, setSelectedCategory ] = useState(0)
    const [ sortBy, setSortBy ] = useState(0)
    const [ searchBy, setSearchBy ] = useState('')
    const [ searchTarget, setSearchTarget ] = useState('all')
    const [ period, setPeriod ] = useState('all')

    async function fetchMainCategories() {
        let url = `${serverUrl}/api/categories?lang=${i18n.language}`

        const res = await fetch(url)
        const data = await res.json()

        if(data.categories.length > 0){
            setCategoryList(data.categories)
        }
    }

    useEffect(() => {
        fetchMainCategories()
    },[])

    useEffect(() => {
        // console.log('triggered!! Category: ' + selectedCategory + ' / sortBy: '+ sortBy + ' / searchBy: '+ searchBy + ' / searchTarget: '+ searchTarget)
        setBingoLoading(true)
        setBingoPage(1)
        fetchMainBingos(1)
    }, [selectedCategory, sortBy, searchBy, searchTarget, period, i18n.language])

    const fetchMainBingos = useCallback( async (pageParam) => {
        let url = `${serverUrl}/api/bingos?lang=${i18n.language}`

        url += `&category=${selectedCategory}`

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

        url += `&page=${pageParam}&limit=${bingoLimit}`

        console.log(url)

        const res = await fetch(url)
        const data = await res.json()

        // console.log(data)
        if(data.bingos.length === 0 || data.bingos.length < bingoLimit) {
            setBingoHasMore(false)
        } else {
            setBingoHasMore(true)
        }

        if(pageParam === 1){
            setBingoList(data.bingos)
            setBingoPage(pageParam + 1)
            setBingoLoading(false)
        } else {
            setBingoList([...bingoList, ...data.bingos])
            setBingoPage(pageParam + 1)
            setBingoLoading(false)
        }
    },[bingoList, selectedCategory, sortBy, searchBy, searchTarget, period]) 

    return (
        <InitialContents.Provider value={{ 
            categoryList: categoryList,
            bingoList: bingoList,
            bingoPage: bingoPage,
            setBingoPage: setBingoPage,
            bingoLoading: bingoLoading,
            bingoHasMore: bingoHasMore,

            selectedCategory: selectedCategory,
            setSelectedCategory: setSelectedCategory,
            sortBy: sortBy,
            setSortBy: setSortBy,
            searchBy: searchBy,
            setSearchBy: setSearchBy,
            searchTarget: searchTarget,
            setSearchTarget: setSearchTarget,
            period: period,
            setPeriod: setPeriod,

            fetchMainBingos: fetchMainBingos,
            // applyChangesAndFetch: applyChangesAndFetch,
        }}>
            {props.children}
        </InitialContents.Provider>
    ) 
}

export default InitialContentsProvider