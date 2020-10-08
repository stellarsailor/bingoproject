import React, { useState, useCallback, useEffect } from 'react'
import styled from 'styled-components'
import { Modal, Radio } from 'antd'
import TwitterPicker  from 'react-color/lib/Twitter'
import { useCookies } from 'react-cookie'
import { useTranslation } from '../i18n'

const SampleView = styled.div`
    width: 100px;
    height: 100px;
    border: 2px solid rgba(0, 0, 0, 0.9); 
    background-color: ${props => props.markColor}; 
    background-image: ${props => props.markStyle === 'paint' ? null : `url("/static/images/${props.markStyle}.png")`} ; 
    background-size: cover;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    margin-top: 1rem;
    margin-bottom: 1rem;
`


export default function MarkStyleModal (props){
    const { t, i18n } = useTranslation()
    const [ cookies, setCookie ] = useCookies(['setting'])
    
    const { markStyle, setMarkStyle, markColor, setMarkColor, visible, setStyleModal } = props
    
    const [ sampleStyle, setSampleStyle ] = useState('')
    const [ sampleColor, setSampleColor ] = useState('')
    
    const options = [
        { label: t("MODAL_MARKSTYLE_CHECK"), value: 'check' },
        { label: t("MODAL_MARKSTYLE_CIRCLE"), value: 'circle' },
        { label: t("MODAL_MARKSTYLE_PAINT"), value: 'paint' },
    ]

    useEffect(() => {
        setSampleStyle(markStyle)
        setSampleColor(markColor)
    },[markStyle, markColor])

    const saveStyleAndColor = useCallback((nextStyle, nextColor) => {
        setStyleModal(false)
        const nextSetting = {style: nextStyle, color: nextColor}
        setCookie('setting', nextSetting, { path: '/' })
        setMarkStyle(nextStyle)
        setMarkColor(nextColor)
    },[])

    const cancelStyleAndColor = useCallback(() => {
        setStyleModal(false)
        setTimeout(() => { //모달 사라질때 이전 옵션 잠깐 깜빡이면서 남아있는거 방지
            setSampleStyle(markStyle)
            setSampleColor(markColor)
        }, 500);
    },[markStyle, markColor])

    return (
        <Modal
            title={t("PLAYPAGE_SETTING")}
            visible={visible}
            onOk={() => saveStyleAndColor(sampleStyle, sampleColor)}
            onCancel={() => cancelStyleAndColor()}
        >
            <Radio.Group
            options={options}
            onChange={e => setSampleStyle(e.target.value)}
            value={sampleStyle}
            optionType="button"
            buttonStyle="solid"
            />

            <SampleView markStyle={sampleStyle} markColor={sampleColor}>
                {t("MODAL_MARKSTYLE_SAMPLE")}
            </SampleView>

            <TwitterPicker color={sampleColor} onChangeComplete={(v) => {setSampleColor(v.hex)}} />

        </Modal>
    )
}