import styled from 'styled-components';
import { useTranslation } from '../i18n';
const ReactMarkdown = require('react-markdown')

const Container = styled.div`
    margin-top: 66px;
    border-radius: 3px;
    background-color: white;
    border: 1px solid lightgray;
    padding: 2rem;
    display: flex;
    flex-direction: column;
`

const input = {
en:
`
# Privacy Policy

본 약관은 회원님의 SelfBingo에 이용에 적용되며, 아래 설명된 SelfBingo에 서비스에 관한 정보를 제공합니다. 

회원님이 SelfBingo를 이용하면 회원님은 본 약관에 동의하는 것입니다.
    
`,
ko: 
`
# 개인정보처리방침

본 약관은 회원님의 SelfBingo에 이용에 적용되며, 아래 설명된 SelfBingo에 서비스에 관한 정보를 제공합니다. 

회원님이 SelfBingo를 이용하면 회원님은 본 약관에 동의하는 것입니다.
    
`,
}

export default function Privacy() {
    const { t, i18n } = useTranslation()

    return (
        <>
            <Container>
                <ReactMarkdown source={input[i18n.language] === undefined ? input['en'] : input[i18n.language] } />
            </Container>
        </>
    )
}