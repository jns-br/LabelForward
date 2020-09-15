import React, { Component } from 'react';
import { Nav, Navbar } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import AuthService from '../services/AuthService';

class Navigation extends Component {

  state = {
    redirect: ''
  }

  handleClickHome = event => {
    event.preventDefault();
    this.setState({redirect: '/home'});
  }

  handleClickSettings = event => {
    event.preventDefault();
    this.setState({redirect: '/settings'});
  }

  handleClickMonitor = event => {
    event.preventDefault();
    this.setState({redirect: '/monitor'});
  }

  handleClickLogout = async event => {
    event.preventDefault();
    await AuthService.logout();
    this.setState({redirect: '/'})
  }

  renderRedirect = () => {
    if (this.state.redirect !== '') {
      return <Redirect to={this.state.redirect} />
    }
  }

  render() {
    return (
      <Navbar bg="light" expand="lg">
        {this.renderRedirect()}
        <Navbar.Brand href="#home">CovidState</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link href="home" to="/home" onClick={this.handleClickHome}>Home</Nav.Link>
            <Nav.Link href="monitor" to="/monitor" onClick={this.handleClickMonitor}>Monitor</Nav.Link>
            <Nav.Link href="settings" to="/settings" onClick={this.handleClickSettings}>Settings</Nav.Link>
            <Nav.Link href="/" to="/" onClick={this.handleClickLogout}>Logout</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    )
  }
}

export default Navigation;