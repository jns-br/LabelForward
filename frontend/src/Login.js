import React, { Component } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import './Login.css'

class Login extends Component {

  state = {
    redirect: false,
    email: "",
    password: "",
    alert: ""
  }

  setRedirect = () => {
    this.setState({ redirect: true });
  }

  setAlert = alert => {
    this.setState({ alert: alert });
  }

  renderRedirect = () => {
    if (this.state.redirect) {
      return <Redirect to='/home' />
    }
  }

  handleEmailChange = event => {
    this.setState({
      email: event.target.value
    })
  }

  handlePasswordChange = async event => {
    const crypto_pw = await this.digestPassword(event.target.value);
    this.setState({
      password: crypto_pw
    })
  }

  handleLogin = event => {
    event.preventDefault();
    console.log('email: ', this.state.email);
    console.log('password: ', this.state.password)
    this.setRedirect();
  }
  
  async digestPassword(password) {
    const pwUint8 = new TextEncoder().encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', pwUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
  }

  render() {
    return (
      <div className="LoginForm">
        {this.renderRedirect()}
        <h2 className="LoginHeader">CovidState Login</h2>
        <Form>
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control type="email" placeholder="Enter email" onChange={this.handleEmailChange} />
          </Form.Group>
          <Form.Group controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Password" onChange={this.handlePasswordChange} />
          </Form.Group>
          <Button variant="primary" type="submit" onClick={this.handleLogin}>
            Login
              </Button>
        </Form>
      </div>
    )
  }
}

export default Login;