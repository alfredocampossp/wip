import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';

const Layout = ({ children }) => {
    return (
        <div>
            <Navbar bg="dark" variant="dark" expand="lg">
                <Container>
                    <Navbar.Brand as={Link} to="/">WIP</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link as={NavLink} to="/">Início</Nav.Link>
                            <Nav.Link as={NavLink} to="/sobre">Sobre</Nav.Link>
                            <Nav.Link as={NavLink} to="/contato">Contato</Nav.Link>
                            <Nav.Link as={NavLink} to="/feedback">Feedback</Nav.Link>
                            <NavDropdown title="Empresas" id="basic-nav-dropdown">
                                <NavDropdown.Item as={NavLink} to="/empresas/cadastro">Cadastro</NavDropdown.Item>
                                <NavDropdown.Item as={NavLink} to="/empresas/lista">Lista</NavDropdown.Item>
                                <NavDropdown.Item as={NavLink} to="/empresa/proposta">Propostas</NavDropdown.Item> {/* Adicionada a rota para Propostas */}
                            </NavDropdown>
                            <NavDropdown title="Bandas" id="basic-nav-dropdown">
                                <NavDropdown.Item as={NavLink} to="/bandas/cadastro">Cadastro</NavDropdown.Item>
                                <NavDropdown.Item as={NavLink} to="/bandas/lista">Lista</NavDropdown.Item>
                            </NavDropdown>
                            <Nav.Link as={NavLink} to="/agenda">Agenda</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <Container className="mt-4">
                {children}
            </Container>
        </div>
    );
};

export default Layout;