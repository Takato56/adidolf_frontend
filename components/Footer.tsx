import { Container, Row, Col } from "react-bootstrap";

function Footer() {
    return (
        <footer className="footer">
            <Container fluid>
                <Row className="py-3 footer-section">
                    <Col xs={12} md={4}>
                        <span className="footer-title">About</span>
                        <div className="footer-links mt-2">
                            <a href="#" className="footer-link">Company</a>
                            <a href="#" className="footer-link">Our Mission Statement</a>
                            <a href="#" className="footer-link">Careers</a>
                        </div>
                    </Col>
                    <Col xs={12} md={4}>
                        <span className="footer-title mt-3 mt-md-0">Support</span>
                        <div className="footer-links mt-2">
                            <a href="#" className="footer-link">Contact Us</a>
                            <a href="#" className="footer-link">FAQ</a>
                        </div>
                    </Col>

                    <Col xs={12} md={4}>
                        <span className="footer-title mt-3 mt-md-0">Legal</span>
                        <div className="footer-links mt-2">
                            <a href="#" className="footer-link">Terms of Service</a>
                            <a href="#" className="footer-link">Privacy Policy</a>
                        </div>
                    </Col>
                </Row>

                <Row className="py-3 footer-bottom border-top-footer">
                    <Col xs={12}>
                        <span className="footer-muted">© 2026 Adidolf. All rights reserved.</span>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
}

export default Footer;