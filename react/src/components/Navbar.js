import React, { useState, useEffect } from 'react'
import logo from './files/logo.png'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import "./styles.css"

function NavbarComp(){
    const [admin, setAdmin] = useState(false);
    const [id, setId] = useState("");

    useEffect(() => {
        let admin_system = localStorage.getItem("admin_system");
        setId(localStorage.getItem("codigo"));
        if (admin_system === "true" || parseInt(admin_system) === 1) {
            setAdmin(true)
        }
    }, [admin])

    const handleLogout = () => {
        localStorage.removeItem("login")
        localStorage.removeItem("senha")
        localStorage.removeItem("codigo")
        localStorage.removeItem("admin_system")
    }

    return (
        <Navbar style={{
            position: 'fixed',
            left: '0px',
            right: '0px',
            width: '100%',
            top: '0px',
            zIndex: '10'
        }} expand="lg">
            <Container>
                <Navbar.Brand href="/">
                    <img src={logo}
                        alt="Logo"
                        width="80"
                        height="80" 
                        style={{ opacity: 1 }}/>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" style={{ marginRight:'20px' }} />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link href="/home"
                            style={{ fontSize: 'x-large', 
                                     color: 'black', 
                                     fontWeight: 'bolder',
                                     fontFamily: 'serif' }}>
                                        Home
                        </Nav.Link>
                        {admin && (
                            <>
                                <Nav.Link href="/users"
                                    style={{
                                        fontSize: 'x-large',
                                        color: 'black',
                                        fontWeight: 'bolder',
                                        fontFamily: 'serif'
                                    }}>
                                    Usuários
                                </Nav.Link>
                                <Nav.Link href="/companies"
                                    style={{
                                        fontSize: 'x-large',
                                        color: 'black',
                                        fontWeight: 'bolder',
                                        fontFamily: 'serif'
                                    }}>
                                    Empresas
                                </Nav.Link>
                                <Nav.Link href="/actions"
                                    style={{
                                        fontSize: 'x-large',
                                        color: 'black',
                                        fontWeight: 'bolder',
                                        fontFamily: 'serif'
                                    }}>
                                    Ações
                                </Nav.Link>
                                <Nav.Link href="/questions"
                                    style={{
                                        fontSize: 'x-large',
                                        color: 'black',
                                        fontWeight: 'bolder',
                                        fontFamily: 'serif'
                                    }}>
                                    Perguntas
                                </Nav.Link>
                            </>
                        )}
                        {!admin && (
                            <Nav.Link href={`/users/formulario/${id}`}
                                style={{ fontSize: 'x-large', 
                                    color: 'black', 
                                    fontWeight: 'bolder',
                                    fontFamily: 'serif' }}>
                                Dados Pessoais
                            </Nav.Link>
                        )}
                        <Nav.Link href="/" onClick={handleLogout}
                            style={{ fontSize: 'x-large', 
                                color: 'red', 
                                fontWeight: 'bolder',
                                fontFamily: 'serif' }}>
                            Logout
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default NavbarComp
