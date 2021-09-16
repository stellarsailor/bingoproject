import Navbar from "./Navbar";
import { Row, Col } from "antd";
import Head from "next/head";
import { useRouter } from "next/router";
import Adfit from "./sub/Adfit";
import Sticky from "react-sticky-el";

export default function Layout(props) {
  const router = useRouter();

  return (
    <div>
      <link
        href="https://fonts.googleapis.com/css2?family=Noto+Sans"
        rel="stylesheet"
      />

      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, user-scalable=no"
        />
      </Head>

      {router.pathname === "/bingo/create" || router.pathname === "/about" ? (
        <Row style={{ width: "100%", backgroundColor: "var(--mono-1)" }}>
          {props.children}
        </Row>
      ) : (
        <>
          <Navbar />
          <Row
            justify="center"
            style={{ backgroundColor: "var(--mono-1)", minHeight: "100vh" }}
          >
            <Col xs={0} sm={0} md={0} lg={4} xl={6} style={{ marginTop: 58 }} />
            <Col
              xs={24}
              sm={22}
              md={20}
              lg={16}
              xl={12}
              style={{ marginTop: 58 }}
            >
              {props.children}
            </Col>
            <Col xs={0} sm={0} md={0} lg={4} xl={6} style={{ marginTop: 58 }}>
              <Sticky>
                <Adfit adType="pc-long" />
              </Sticky>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
}
