import styled from 'styled-components';
import { Layout, Menu, Row, Col, Input } from 'antd';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Home() {


    return (
        <>
            <Navbar />
            <div>
                <table>
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
                </table>
            </div>
            <Footer />
        </>
    )
}
