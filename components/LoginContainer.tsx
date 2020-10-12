import React from 'react'
import { signIn } from 'next-auth/client'
import { useRouter } from 'next/router'
import { serverUrl } from '../lib/serverUrl'

export default function LoginContainer() {
    const router = useRouter()

    return(
        <>
            <button onClick={() => signIn('google', { callbackUrl: serverUrl })}>Sign in with Google</button>
            <button onClick={() => signIn('apple', { callbackUrl: serverUrl })}>Sign in with Apple</button>
            <button onClick={() => signIn('facebook', { callbackUrl: serverUrl })}>Sign in with FaceBook</button>
            <button onClick={() => signIn('twitter', { callbackUrl: serverUrl })}>Sign in with Twitter</button>
        </>
    )
}