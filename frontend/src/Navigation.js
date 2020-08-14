import React, { Component } from 'react';
import { Nav, Navbar } from 'react-bootstrap';

class Navigation extends Component {

  handleClickHome = event => {
    event.preventDefault();
    console.log('Clicked Home Button');
  }

  handleClickSettings = event => {
    event.preventDefault();
    console.log('Click Settings Button');
  };

  handleClickLogout = event => {
    event.preventDefault();
    console.log('Clicked Logout Button');
  }

  render() {
    return (
      <Navbar bg="light" expand="lg">
        <Navbar.Brand href="#home">CovidState</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link href="#home" onClick={this.handleClickHome}>Home</Nav.Link>
            <Nav.Link href="#settings" onClick={this.handleClickSettings}>Settings</Nav.Link>
            <Nav.Link href="#link" onClick={this.handleClickLogout}>Logout</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    )
  }
}

export default Navigation;