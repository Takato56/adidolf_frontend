import { Container, Row, Col, Stack, Image, Nav, NavLink } from "react-bootstrap"

function Footer() {
    return(
        <footer className="footer">
            <Container fluid>
                <Row className="align-left">
                    <Col xs="auto">Help</Col>
                </Row>
                <Row className="align-left links">
                    <Col xs="auto">
                        <a href="">My Account</a>
                    </Col>
                </Row>
                <Row className="align-left">
                    <Col>About</Col>
                </Row>
                <Row className="align-left links">
                    <Col xs="auto">
                        <a href="">Company</a>
                    </Col>
                    <Col xs="auto">
                        <a href="">Our Mission Statement</a>
                    </Col>
                    <Col xs="auto">
                        <a href="">Careers</a>
                    </Col>
                </Row>
            </Container>
        </footer>
    )
}

export default Footer;