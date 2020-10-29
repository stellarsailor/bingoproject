import { BarsOutlined, BgColorsOutlined, HighlightOutlined, InfoCircleOutlined, TrophyOutlined } from "../../assets/icons";
import styled from 'styled-components'
import useWindowSize from "../../logics/useWindowSize";

const EachButton = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    width: 70px;
    height: 70px;
    color: ${props => props.isSelected ? 'white' : 'gray' };
    background-color: ${props => props.isSelected ? '#293039' : 'var(--mono-8)' };
    font-size: 10px;
    transition: 0.2s;
    transition-timing-function: ease-in;
    &:hover {
        cursor: pointer;
    }
`

export default function CreateButtonTab(props){
    const [ width, height ] = useWindowSize()

    return (
        <div style={{width: width < 768 ? width : 70, height: '100%', backgroundColor: 'var(--mono-8)', color: 'white', display: 'flex', flexDirection: width < 768 ? 'row' : 'column'}}>
            <EachButton isSelected={props.selectedButton === 0} onClick={() => props.setSelectedButton(0)}>
                <InfoCircleOutlined style={{fontSize: 20}} />
                Information
            </EachButton>
            <EachButton isSelected={props.selectedButton === 1} onClick={() => props.setSelectedButton(1)}>
                <HighlightOutlined style={{fontSize: 20}} />
                Color
            </EachButton>
            <EachButton isSelected={props.selectedButton === 2} onClick={() => props.setSelectedButton(2)}>
                <BgColorsOutlined style={{fontSize: 20}} />
                Bkground
            </EachButton>
            <EachButton isSelected={props.selectedButton === 3} onClick={() => props.setSelectedButton(3)}>
                <BarsOutlined style={{fontSize: 20}} />
                Edit Bingo
            </EachButton>
            <EachButton isSelected={props.selectedButton === 4} onClick={() => props.setSelectedButton(4)}>
                <TrophyOutlined style={{fontSize: 20}} />
                Acheivements
            </EachButton>
        </div>
    )
}