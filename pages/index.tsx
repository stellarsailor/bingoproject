import styled from 'styled-components';
import { Menu, Row, Col, Input, Button } from 'antd';

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

export default function Home() {

    return (
        <Layout>
            <MainContent>
                <MainText>MAKE</MainText>
                <MainText>YOUR</MainText>
                <MainText>BINGO</MainText>
                <DisplayRow>
                    <MainButton type="primary" size="large" theme='black'> Make My Own </MainButton>
                    <MainButton size="large" theme='white'> View List </MainButton>
                </DisplayRow>
                {/* <table>
                    <tbody>
                        <tr>
                            <td>지금 유행 빙고 1</td>
                            <td>지금 유행 빙고 2</td>
                            <td>지금 유행 빙고 3</td>
                        </tr>
                        <tr>
                            <td>지금 유행 빙고 1</td>
                            <td>지금 유행 빙고 2</td>
                            <td>지금 유행 빙고 3</td>
                        </tr>
                        <tr>
                            <td>지금 유행 빙고 1</td>
                            <td>지금 유행 빙고 2</td>
                            <td>지금 유행 빙고 3</td>
                        </tr>
                    </tbody>
                </table> */}
            </MainContent>
        </Layout>
    )
}
