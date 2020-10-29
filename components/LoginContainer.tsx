import React from 'react'
import { signIn } from 'next-auth/client'
import { useRouter } from 'next/router'
import { serverUrl } from '../lib/serverUrl'
import styled from 'styled-components'
import { CenteredCol } from './sub/styled'
import { Button } from 'antd'

const SignInButton = styled(Button)`
    border: 1px solid var(--mono-3);
    width: 220px;
    height: 40px;
    border-radius: 4px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 8px 0px;
`

const ButtonText = styled.span`
    margin-left: 4px;
`

export default function LoginContainer() {
    const router = useRouter()

    return(
        <CenteredCol>
            <SignInButton onClick={() => signIn('google', { callbackUrl: serverUrl })}>
                <svg width="25" height="25" ><g fill="none" fillRule="evenodd"><path d="M20.66 12.7c0-.61-.05-1.19-.15-1.74H12.5v3.28h4.58a3.91 3.91 0 0 1-1.7 2.57v2.13h2.74a8.27 8.27 0 0 0 2.54-6.24z" fill="#4285F4"></path><path d="M12.5 21a8.1 8.1 0 0 0 5.63-2.06l-2.75-2.13a5.1 5.1 0 0 1-2.88.8 5.06 5.06 0 0 1-4.76-3.5H4.9v2.2A8.5 8.5 0 0 0 12.5 21z" fill="#34A853"></path><path d="M7.74 14.12a5.11 5.11 0 0 1 0-3.23v-2.2H4.9A8.49 8.49 0 0 0 4 12.5c0 1.37.33 2.67.9 3.82l2.84-2.2z" fill="#FBBC05"></path><path d="M12.5 7.38a4.6 4.6 0 0 1 3.25 1.27l2.44-2.44A8.17 8.17 0 0 0 12.5 4a8.5 8.5 0 0 0-7.6 4.68l2.84 2.2a5.06 5.06 0 0 1 4.76-3.5z" fill="#EA4335"></path></g></svg>
                <ButtonText>
                    Sign in with Google
                </ButtonText>
            </SignInButton>
            {/* <SignInButton onClick={() => signIn('apple', { callbackUrl: serverUrl })}>
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/505px-Apple_logo_black.svg.png" width="15" height="18"></img>
                <ButtonText>
                    Sign in with Apple
                </ButtonText>
            </SignInButton> */}
            <SignInButton onClick={() => signIn('facebook', { callbackUrl: serverUrl })}>
                <svg width="25" height="25" fill="#3B5998"><path d="M20.3 4H4.7a.7.7 0 0 0-.7.7v15.6c0 .38.32.7.7.7h8.33v-6.38h-2.12v-2.65h2.12V9.84c0-2.2 1.4-3.27 3.35-3.27.94 0 1.75.07 1.98.1v2.3H17c-1.06 0-1.31.5-1.31 1.24v1.76h2.65l-.53 2.65H15.7l.04 6.38h4.56a.7.7 0 0 0 .71-.7V4.7a.7.7 0 0 0-.7-.7" fillRule="evenodd"></path></svg>
                <ButtonText>
                    Sign in with FaceBook
                </ButtonText>
            </SignInButton>
            {/* <SignInButton onClick={() => signIn('twitter', { callbackUrl: serverUrl })}>
                <img src="https://upload.wikimedia.org/wikipedia/sco/thumb/9/9f/Twitter_bird_logo_2012.svg/1200px-Twitter_bird_logo_2012.svg.png" width="20" height="16"></img>
                <ButtonText>
                    Sign in with Twitter
                </ButtonText>
            </SignInButton> */}

            <div style={{color: 'var(--mono-3)', margin: '32px 16px', textAlign: 'center'}}>
                Click “Sign In” to agree to SelfBingo's Terms of Service and acknowledge that SelfBingo's Privacy Policy applies to you.
            </div>
        </CenteredCol>
    )
}