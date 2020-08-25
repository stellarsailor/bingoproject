import styled from 'styled-components'
import Modal from 'antd/lib/modal/Modal'
import { useState, useCallback, useEffect, useRef } from 'react'
import { Input } from 'antd'
import { CenteredRow, CenteredCol } from './sub/styled'
import pickTextColorBasedOnBgColor from '../logics/pickTextColorBasedOnBgColor'

const CreatePage = styled.div`
    margin-top: 1rem;
    background: ${(props) => `-webkit-linear-gradient(${props.bgMainColor}, ${props.bgSubColor})` };
    width: 100%;
    padding: 1rem;
    border: 1px solid lightgray;
`

const TitleText = styled.div`
    color: ${props => props.color};
    font-weight: bold;
    font-size: 1.6rem;
`

export default function BingoRenderer( props ){

    const { title, author, size, elements, elementOnClickEvent, bgMainColor, bgSubColor, fontColor, cellColor, lineColor, linePixel } = props

    const ref = useRef(null);

    useEffect(() => {
        setCellWidth(ref.current ? ref.current.offsetWidth : 0);
    }, [ref.current]);

    const [ cellWidth, setCellWidth ] = useState(0)

    const renderTable = (size) => {
        let rows = []
        
        for(let i = 0; i < size; i++){
            rows.push(
                <tr key={i}>
                    {elements.map((v, index) => {
                        if( size * i <= index && index < size * (i+1) ){
                            return (
                                <td key={index} style={{border: `${linePixel}px solid ${lineColor}`, backgroundColor: `${cellColor}`}} onClick={() => elementOnClickEvent(index)}>
                                    <div style={{width: (cellWidth - 50) / size, height: (cellWidth - 50) / size, display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center', color: `${fontColor}`, overflow: 'hidden', fontSize: cellWidth / size / 10}}>
                                        {v}
                                    </div>
                                </td>
                            )
                        }
                    })}
                </tr>
            )
        }
        return rows
    }

    return (
        <>
            <CreatePage ref={ref} bgMainColor={bgMainColor} bgSubColor={bgSubColor}>
                <CenteredCol>
                    <TitleText color={pickTextColorBasedOnBgColor(bgMainColor, '#ffffff', '#000000')}>
                        {title} <span style={{fontSize: '1rem'}}>({author})</span>
                    </TitleText>
                    <table style={{}}>
                        <tbody>
                            {renderTable(size)}
                        </tbody>
                    </table>
                    <div style={{color: `${pickTextColorBasedOnBgColor(bgMainColor, '#ffffff', '#000000')}`, fontWeight: 'bold', fontSize: '1rem', marginTop: '1rem'}}>
                        selfbingo.com
                    </div>
                </CenteredCol>
            </CreatePage>
        </>
    )
}