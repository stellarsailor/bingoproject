import styled from 'styled-components'
import Modal from 'antd/lib/modal/Modal'
import { useState, useCallback, useEffect, useRef } from 'react'
import { Input } from 'antd'
import { CenteredRow, CenteredCol } from './sub/styled'
import pickTextColorBasedOnBgColor from '../logics/pickTextColorBasedOnBgColor'
import useWindowSize from '../logics/useWindowSize'

const CreatePage = styled.div`
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

const AuthorText = styled.div`
    color: ${props => props.color};
    font-weight: bold;
    font-size: 0.8rem;
`

export default function BingoRenderer( props ){

    const { id, title, author, size, elements, elementOnClickEvent, selectedIndex, bgMainColor, bgSubColor, fontColor, cellColor, lineColor, linePixel, ipAddress } = props

    const ref = useRef(null);

    const [width, height] = useWindowSize();

    useEffect(() => {
        setCellWidth(ref.current ? ref.current.offsetWidth : 0)
    }, [width])

    const [ cellWidth, setCellWidth ] = useState(0)

    const renderTable = (size) => {
        let rows = []
        
        for(let i = 0; i < size; i++){
            rows.push(
                <tr key={i}>
                    {elements.map((v, index) => {
                        if( size * i <= index && index < size * (i+1) ){
                            return (
                                <td key={index} style={{border: `${linePixel}px solid ${lineColor}`, backgroundColor: `${selectedIndex.includes(index) ? 'gold' : cellColor}`}} onClick={() => elementOnClickEvent(index)}>
                                    <a>
                                        <div style={{width: (cellWidth - 50) / size, height: (cellWidth - 50) / size, display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center', color: `${fontColor}`, overflow: 'hidden', fontSize: cellWidth / size / 9}}>
                                            {v}
                                        </div>
                                    </a>
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
            <CreatePage ref={ref} bgMainColor={bgMainColor} bgSubColor={bgSubColor} id={id}>
                <CenteredCol>
                    <TitleText color={pickTextColorBasedOnBgColor(bgMainColor, '#ffffff', '#000000')}>
                        {title} 
                    </TitleText>
                    <AuthorText color={pickTextColorBasedOnBgColor(bgMainColor, '#ffffff', '#000000')}>
                        by {author} ({ipAddress})
                    </AuthorText>
                    <table style={{}}>
                        <tbody>
                            {renderTable(size)}
                        </tbody>
                    </table>
                    <div style={{color: `${pickTextColorBasedOnBgColor(bgMainColor, '#ffffff', '#000000')}`, fontWeight: 'bold', fontSize: '1.4rem', marginTop: '1rem'}}>
                        selfbingo.com
                    </div>
                </CenteredCol>
            </CreatePage>
        </>
    )
}