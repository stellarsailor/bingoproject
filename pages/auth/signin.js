import React from 'react'
import { providers, signIn } from 'next-auth/client'
import LoginContainer from '../../components/LoginContainer'

export default function SignIn({ providers }) {
    return (
        <>
            <div id='Custom' style={{margin: 80}}>
              Custom Signin Page
              {/* {Object.values(providers).map(provider => (
                  <div key={provider.name}>
                      <button onClick={() => signIn(provider.id)}>Sign in with {provider.name}</button>
                  </div>
              ))} */}
              <LoginContainer />
            </div>
        </>
    )
}

// SignIn.getInitialProps = async (context) => {
//     return {
//         providers: await providers(context)
//     }
// }