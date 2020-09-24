import React, { useState, useCallback, useEffect } from 'react'
import styled from 'styled-components'
import { Modal, message, Select } from 'antd'
import { serverUrl } from '../lib/serverUrl'
import { useRouter } from 'next/router'
import TextArea from 'antd/lib/input/TextArea'

message.config({
    top: 58,
})
const { Option } = Select;

export default function ReportModal (props){
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
                message.success('The report is successfully submitted.')
            } else {
                message.error('Error! Try again few minutes later.')
            }
        } catch (e) {
            return e
        }    
    }

    return(
        <Modal
            title="Report Bingo"
            visible={visible}
            onOk={() => reportBingo(reportType, reportText)}
            onCancel={() => setReportModal(false)}
        >
            <Select defaultValue={0} style={{ width: 120, marginBottom: '1rem' }} onChange={v => setReportType(v)}>
                <Option value={0}>광고</Option>
                <Option value={1}>음란물</Option>
                <Option value={2}>개인정보침해</Option>
                <Option value={3}>저작권침해</Option>
                <Option value={4}>기타</Option>
            </Select>

            <TextArea rows={4} onChange={(e) => setReportText(e.target.value)} value={reportText} />
        </Modal>
    )

}