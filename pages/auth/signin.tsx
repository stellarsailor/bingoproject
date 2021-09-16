import React from "react";
import { Row, Col } from "antd";
import { providers, signIn } from "next-auth/client";
import LoginContainer from "../../components/LoginContainer";
import { CenteredCol } from "../../components/sub/styled";
import { useTranslation } from "../../i18n";

export default function SignIn({ providers }) {
  const { t, i18n } = useTranslation();

  return (
    <Row>
      <Col
        xs={24}
        sm={24}
        md={24}
        lg={24}
        xl={24}
        style={{ backgroundColor: "white", border: "1px solid lightgray" }}
      >
        <CenteredCol style={{ fontSize: "2rem", margin: "32px 0px" }}>
          Join SelfBingo.
        </CenteredCol>
        <CenteredCol style={{ fontSize: "1rem", margin: "32px 0px" }}>
          {t("SIGN_IN_WARNING")}
        </CenteredCol>
        {/* {Object.values(providers).map(provider => (
                    <div key={provider.name}>
                        <button onClick={() => signIn(provider.id)}>Sign in with {provider.name}</button>
                    </div>
                ))} */}
        <LoginContainer />
      </Col>
    </Row>
  );
}

// SignIn.getInitialProps = async (context) => {
//     return {
//         providers: await providers(context)
//     }
// }
