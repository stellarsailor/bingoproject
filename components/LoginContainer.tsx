import React from 'react'
import { signIn } from 'next-auth/client'
import { useRouter } from 'next/router'
import { serverUrl } from '../lib/serverUrl'

export default function LoginContainer() {
    const router = useRouter()
    console.log(serverUrl)

    return(
        <>
            <button onClick={() => signIn('google', { callbackUrl: serverUrl })}>Sign in with Google</button>
            <button onClick={() => signIn('apple')}>Sign in with Apple</button>
            <button onClick={() => signIn('facebook')}>Sign in with FaceBook</button>
            <button onClick={() => signIn('twitter')}>Sign in with Twitter</button>
        </>
    )
}