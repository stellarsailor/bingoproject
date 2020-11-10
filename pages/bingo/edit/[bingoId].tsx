import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useSession } from 'next-auth/client'
import { useTranslation, Router } from '../../../i18n';
import styled from 'styled-components'
import { InitialContents } from '../../../store/InitialContentsProvider';
import { Row, Col, message, Checkbox, Button } from 'antd'
import { serverUrl } from '../../../lib/serverUrl';
import { useRouter } from 'next/router';
import BingoCreateInformationPane from '../../../components/BingoCreateInformationPane';
import { CenteredCol } from '../../../components/sub/styled';
import BingoCreateAchievementPane from '../../../components/BingoCreateAchievementPane';

message.config({
    top: 58,
})

const ControllerPage = styled.div`
    background-color: white;
    border: 1px solid lightgray;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0px 16px;
`

export default function Edit( ){
    const { t, i18n } = useTranslation()
    const router = useRouter()
    const [ session, loading ] = useSession()
    const { categoryList } = useContext(InitialContents)

    const [ bingo, setBingo ] = useState<any>({})

    const [ bingoCategory, setBingoCategory ] = useState<any>(0)
    const [ bingoTitle, setBingoTitle ] = useState('')
    const [ bingoDescription, setBingoDescription ] = useState('')
    const [ enableAchievement, setEnableAchievement ] = useState(false)
    const [ bingoAchievement, setBingoAchievement ] = useState([])

    useEffect(() => {
        async function fetchBingoData(){
            let url = `${serverUrl}/api/bingos/${router.query.bingoId}`
    
            const res = await fetch(url)
            const data = await res.json()
            // console.log(data)
            setBingo(data.bingo)
            setBingoCategory(data.bingo.categoryId)
            setBingoTitle(data.bingo.title)
            setBingoDescription(data.bingo.description)

            let ach = JSON.parse(data.bingo.achievements)
            if(ach[0] !== ''){
                setEnableAchievement(true)
            }
            setBingoAchievement(ach)
        }
        fetchBingoData()
    },[])

    const editBingo = useCallback( async () => {
        let blankError = [] //에러는 역순으로
        if(enableAchievement){
            bingoAchievement.map(v => {if(v === '' || v === null) blankError.push(t("CREATE_EMPTY_ALERT_ACCOMPLISHMENTS"))})
        } //else, Achievement is disabled so not to check blank
        if(blankError.length !== 0){
            message.error(blankError.pop())
        } else {
            let url = `${serverUrl}/api/bingos/${router.query.bingoId}`
            const settings = {
                method: 'PATCH',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: session.user.id,
                    accessToken: session.accessToken,
                    category: bingoCategory + 1,
                    title: bingoTitle,
                    description: bingoDescription,
                    achievements: bingoAchievement,
                })
            }
            try {
                const fetchResponse = await fetch(url, settings)
                const data = await fetchResponse.json()
    
                if(data.results === 'success'){
                    Router.push('/')
                    message.success(t("PLAYPAGE_EDIT_SUCCESS"))
                } else {
                    message.error('Error!')
                }
            } catch (e) {
                return e
            }
        }
    },[ bingoCategory, bingoTitle, bingoDescription, bingoAchievement, session ])

    if (loading) {
        return <p>Loading…</p>
    }

    if (!loading && !session) {
        Router.push('/auth/signin')
        return <p>Loading…</p>
    }
    // session.user.id !== bingo.userId

    return (
        <ControllerPage>
            <Row>
                <Col xs={24} sm={12} md={12} lg={12} xl={12} style={{padding: 16}}>
                    <BingoCreateInformationPane
                    categoryList={categoryList}
                    bingoCategory={bingoCategory}
                    setBingoCategory={setBingoCategory}
                    bingoTitle={bingoTitle}
                    setBingoTitle={setBingoTitle}
                    bingoDescription={bingoDescription}
                    setBingoDescription={setBingoDescription}
                    />
                </Col>
                <Col xs={24} sm={12} md={12} lg={12} xl={12} style={{padding: 16}}>
                    <div style={{color: 'black', padding: 8}}>
                        <Checkbox 
                        checked={enableAchievement}
                        style={{color: 'var(--mono-8)', marginBottom: 8}}
                        onChange={e => {
                            if(enableAchievement) { //when becomes false
                                //handleAchievement(0, bingoSize * 2 + 2 + 1, '') // reset achievement, consider number.
                                setEnableAchievement(e.target.checked)
                            } else setEnableAchievement(e.target.checked)
                        }}>
                            <span style={{marginLeft: 8}}>
                                {t("CREATE_BINGO_ACCOMPLISHMENTS")}
                            </span>
                        </Checkbox>
                        <BingoCreateAchievementPane
                        enableAchievement={enableAchievement}
                        bingoAchievement={bingoAchievement}
                        setBingoAchievement={setBingoAchievement}
                        bingoSize={bingo.size}
                        />
                    </div>
                </Col>
                <CenteredCol style={{width: '100%', margin: '2rem', marginBottom: '3rem'}}>
                    <Button type="primary" onClick={editBingo} style={{width: 300, height: 45, borderRadius: 8}}>
                        {t("STATIC_EDIT")}
                    </Button>
                </CenteredCol>
            </Row>
        </ControllerPage>
    )
}