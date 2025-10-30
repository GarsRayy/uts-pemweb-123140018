import React from 'react';
import { Container, Navbar } from 'react-bootstrap';

function Header() {
  return (
    <header>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="#home">
            🖼️ Met Museum Explorer
          </Navbar.Brand>
        </Container>
      </Navbar>
    </header>
  );
}

export default Header;