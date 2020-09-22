import styled from 'styled-components';
import { Link, useTranslation } from '../i18n'
import { Button, Row, Col } from 'antd';
import { CenteredRow, CenteredCol } from '../components/sub/styled';
import useIsMobile from '../logics/useIsMobile';

const MainContent = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
`

const MainText = styled.div`
    /* font-family: 'Gothic A1', sans-serif; */
    font-size: ${ props => props.isMobile ? '4rem' : '8rem' };
    font-weight: 900;
    letter-spacing: -3px;
    background: ${props => 
        props.type === 1 ? '-webkit-linear-gradient(45deg, #007CF0, #00DFD8)' : 
        props.type === 2 ? '-webkit-linear-gradient(45deg, #7928CA, #FF0080)' : 
        '-webkit-linear-gradient(45deg, #007CF0, #00DFD8)' };
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
`

const MainButton = styled(Button)`
    border: 1px solid lightgray;
    border-radius: 5px;
    width: 200px;
    height: 50px;
    margin: 0px 1rem;
    color: ${props => props.theme === 'white' ? 'black' : 'white'};
    background-color: ${props => props.theme === 'black' ? 'black' : 'white'};
`

const ExplanationText = styled.div`
    color: #666;
    text-align: center;
    font-size: 1.2rem;
    margin-bottom: 2rem;
`

const HrLine = styled.div`
    border-bottom: 1px solid lightgray;
    width: 100%;
    margin: 2rem 0.5rem;
`

export default function About() {

    const isMobile = useIsMobile()

    return (
        <>
            <Row style={{padding: 50, backgroundColor: 'white'}}>
                <Col span={24} >
                    <CenteredCol>
                        <MainText type={1} isMobile={isMobile}>PLAY</MainText>
                        <MainText type={1} isMobile={isMobile}>SINGLE</MainText>
                        <MainText type={1} isMobile={isMobile}>BINGO</MainText>
                        <ExplanationText>
                            Selfbingo provides various bingos you can play alone. You can share the bingo with your friends who have similar interests if you want! 
                        </ExplanationText>
                        <Link href="/bingo">
                            <a>
                                <MainButton size="large" theme='white'> View List </MainButton> 
                            </a>
                        </Link>
                    </CenteredCol>
                </Col>
                <HrLine />
                <Col span={24} >
                    <CenteredCol>
                        <MainText type={2} isMobile={isMobile}>MAKE</MainText>
                        <MainText type={2} isMobile={isMobile}>YOUR</MainText>
                        <MainText type={2} isMobile={isMobile}>BINGO</MainText>
                        <ExplanationText>
                            You can make whatever bingo you want easily in Selfbingo.
                        </ExplanationText>
                        <Link href="/bingo/create">
                            <a>
                                <MainButton type="primary" size="large" theme='black'> Make My Own </MainButton>    
                            </a>
                        </Link>
                    </CenteredCol>
                </Col>
                <HrLine />
                <Col span={24} >
                    Contact : selfbingo@gmail.com
                </Col>
            </Row>
        </>
    )
}