import styled from 'styled-components';
import { Menu, Row, Col, Input, Button } from 'antd';
import { Link, useTranslation } from '../i18n'

import Layout from '../components/Layout';

const MainContent = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`

const MainText = styled.div`
    font-family: 'Gothic A1', sans-serif;
    font-size: 9rem;
    font-weight: 900;
    letter-spacing: -5px;
    background: -webkit-linear-gradient(45deg, #007CF0, #00DFD8);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
`

const DisplayRow = styled.div`
    display: flex;
    flex-direction: row;
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

export default function Home({ }) {
    const { t, i18n } = useTranslation();

    return (
        <Layout>
            <MainContent>
                <MainText>MAKE</MainText>
                <MainText>YOUR</MainText>
                <MainText>THING</MainText>
                <DisplayRow>
                    <Link href="/bingo/create">
                        <a>
                            <MainButton type="primary" size="large" theme='black'> Make My Own </MainButton>    
                        </a>
                    </Link>
                    <Link href="/bingo">
                        <a>
                            <MainButton size="large" theme='white'> View List </MainButton> 
                        </a>
                    </Link>
                </DisplayRow>
                {t('SEARCH_INPUT_PLACEHOLER')}
            </MainContent>
        </Layout>
    )
}