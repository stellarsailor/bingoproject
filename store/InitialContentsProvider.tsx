import React, { createContext, useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/router'
import { serverUrl } from '../lib/serverUrl'
import { useTranslation } from '../i18n'
import categories from '../pages/api/categories'

export const InitialContents = createContext({
    bingoList: [],
    categoryList: [],
    refreshInitialContents: () => {}
})

const InitialContentsProvider = (props) => {
    const { t, i18n } = useTranslation();

    // const storeUser = user => {
    //     setUser({
    //         userName: user.userName,
    //     })
    // }

    // const logout = () => {
    //     setUser({})
    // }

    const [ categoryList, setCategoryList ] = useState([])
    const [ bingoList, setBingoList] = useState([])

    async function fetchMainCategories() {
        let url = `${serverUrl}/api/categories?lang=${i18n.language}`

        const res = await fetch(url)
        const data = await res.json()
        setCategoryList(data.categories)
    }

    async function fetchMainBingos() {
        let url = `${serverUrl}/api/bingos?lang=${i18n.language}`

        const res = await fetch(url)
        const data = await res.json()
        setBingoList(data.bingos)
    }

    useEffect(() => {
        fetchMainCategories()
        fetchMainBingos()
    }, [])

    const refreshInitialContents = useCallback(() => {
        console.log('asdas')
        fetchMainBingos()
    },[]) 

    return (
        <InitialContents.Provider value={{
            bingoList: bingoList,
            categoryList: categoryList,
            refreshInitialContents: refreshInitialContents
        }}>
            {props.children}
        </InitialContents.Provider>
    ) 
}

export default InitialContentsProvider