import React, { useState, useCallback, useEffect } from 'react'
import styled from 'styled-components'
import { Modal, message, Select } from 'antd'
import { serverUrl } from '../lib/serverUrl'
import { useRouter } from 'next/router'
import TextArea from 'antd/lib/input/TextArea'
import { useTranslation } from '../i18n'

message.config({
    top: 58,
})
const { Option } = Select;

export default function ReportModal (props){
    const { t, i18n } = useTranslation()
    const router = useRouter()
    
    const { bingoId, visible, setReportModal } = props

    const [ reportType, setReportType ] = useState(0)
    const [ reportText, setReportText ] = useState('')

    const reportBingo = async (type, text) => {
        let url = `${serverUrl}/api/reports`
        const settings = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                bingoId: bingoId,
                type: type,
                text: text
            })
        }
        try {
            setReportModal(false)
            setReportType(0)
            setReportText('')

            const fetchResponse = await fetch(url, settings)
            const data = await fetchResponse.json()

            if(data.insertResult.affectedRows === 1){
                message.success(t("MODAL_REPORT_SUCCESS_MSG"))
            } else {
                message.error(t("STATIC_ERROR_TRY_LATER"))
            }
        } catch (e) {
            return e
        }    
    }

    return(
        <Modal
            title={t("PLAYPAGE_REPORT")}
            visible={visible}
            onOk={() => reportBingo(reportType, reportText)}
            onCancel={() => setReportModal(false)}
        >
            <Select defaultValue={0} style={{ width: 250, marginBottom: '1rem' }} onChange={v => setReportType(v)}>
                <Option value={0}>{t("MODAL_REPORT_ADS")}</Option>
                <Option value={1}>{t("MODAL_REPORT_PORN")}</Option>
                <Option value={2}>{t("MODAL_REPORT_PRIVACY")}</Option>
                <Option value={3}>{t("MODAL_REPORT_COPYRIGHT")}</Option>
                <Option value={4}>{t("STATIC_ETC")}</Option>
            </Select>

            <TextArea rows={4} onChange={(e) => setReportText(e.target.value)} value={reportText} />
        </Modal>
    )

}