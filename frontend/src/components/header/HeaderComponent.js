import { Container, Row, Col, Navbar, Nav } from 'react-bootstrap';
import '../header/HeaderComponent.css';
import Logo from '../images/Logo.png';

function HeaderComponent() {
  return (
    <Navbar className='background'>
      <Container>
        <Row className="w-100 align-items-center">
          <Col xs={8} md={4}>
            <Navbar.Brand href="/"><img src={Logo} alt="Brand Logo" className="logo"></img></Navbar.Brand>
          </Col>
          <Col xs={4} md={8}>
            <Nav className="justify-content-end align-items-center">
              <Nav.Link href="/" className='navButton'>HOME</Nav.Link>
              <Nav.Link href="/ClaimRoutePage.js" className="specialnavButton">CLAIM ROUTE</Nav.Link>
            </Nav>
          </Col>
        </Row>
      </Container>
    </Navbar>
  );
}

export default HeaderComponent;