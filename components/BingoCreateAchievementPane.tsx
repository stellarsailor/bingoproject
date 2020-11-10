import React, { useCallback, useEffect, useState } from 'react'
import { Row, Col, Input, Radio, Select, Modal, InputNumber, Button, message, Slider, Checkbox } from 'antd';
import styled from 'styled-components'
import { useTranslation } from '../i18n';

const marks = [{ 0: '0', 1: '1', 2: '2', 3: '3', 4: '4', 5: '5', 6: '6', 7: '7', 8: '8', 9: '' }, 
{ 0: '0', 1: '1', 2: '2', 3: '3', 4: '4', 5: '5', 6: '6', 7: '7', 8: '8', 9: '9', 10: '10', 11: '11', 12: '12', 13: '' }]

const TextLabel = styled.div`
    color: ${props => props.reverse ? 'var(--mono-7)' : 'var(--mono-2)'};
    font-weight: bold;
    font-size: 1rem;
    margin-bottom: 8px;
`

export default function BingoCreateAchievementPane(props){
    const { t, i18n } = useTranslation()

    const { enableAchievement, bingoAchievement, setBingoAchievement, bingoSize } = props

    const [ achievementInput, setAchievementInput ] = useState('')
    const [ achievementMinimumPointer, setAchievementMinimumPointer ] = useState(0)
    const [ achievementPointer, setAchievementPointer ] = useState(1)

    useEffect(() => {
        if(!enableAchievement) { //when becomes false
            handleAchievement(0, bingoSize * 2 + 2 + 1, '') // reset achievement, consider number.
        } 
    },[enableAchievement])

    const handleAchievement = useCallback((rangeMin, rangeMax, value) => {
        for(let i = rangeMin; i < rangeMax; i++){
            bingoAchievement[i] = value
        }
        setBingoAchievement([...bingoAchievement])
        setAchievementMinimumPointer(rangeMax)
        setAchievementPointer(bingoSize * 2 + 2)
        setAchievementInput('')
    },[bingoAchievement])

    return(
        <>
            { enableAchievement && 
            <>
                <TextLabel reverse={true}>
                    {t("CREATE_BINGO_ACCOMPLISHMENTS_HELP")}
                </TextLabel>
                {bingoAchievement.map((v, index) => 
                    <div key={index}>
                        {index} {t("STATIC_BINGO")}: {v}
                    </div>
                )}
                {
                    achievementMinimumPointer === 0 ?
                    <div>
                        <Slider 
                        defaultValue={achievementPointer} 
                        min={0} max={(bingoSize * 2 + 2) + 1} 
                        onChange={v => setAchievementPointer(v)} 
                        marks={ bingoSize === 3 ? marks[0] : marks[1] }
                        />
                        <Input 
                        style={{width: '70%'}} 
                        value={achievementInput}
                        onChange={e => setAchievementInput(e.target.value)} 
                        onPressEnter={() => {handleAchievement(0, achievementPointer, achievementInput)}}
                        />
                        <Button 
                        style={{marginLeft: '1rem'}} 
                        onClick={() => {handleAchievement(0, achievementPointer, achievementInput)}}
                        > 
                            {t("STATIC_ADD")} 
                        </Button>
                    </div>
                    :
                    <div>
                        <Slider 
                        range 
                        value={[achievementMinimumPointer, achievementPointer]} 
                        min={0} max={(bingoSize * 2 + 2) + 1} 
                        onChange={v => {setAchievementMinimumPointer(v[0]); setAchievementPointer(v[1])}} 
                        marks={ bingoSize === 3 ? marks[0] : marks[1] }
                        />
                        <Input 
                        style={{width: '70%'}}
                        value={achievementInput}
                        onChange={e => setAchievementInput(e.target.value)} 
                        onPressEnter={() => {handleAchievement(achievementMinimumPointer, achievementPointer, achievementInput)}}
                        />
                        <Button 
                        style={{marginLeft: '1rem'}} 
                        onClick={() => {handleAchievement(achievementMinimumPointer, achievementPointer, achievementInput)}}
                        > 
                            {t("STATIC_ADD")}  
                        </Button>
                    </div>
                }
            </>}
        </>
    )
}