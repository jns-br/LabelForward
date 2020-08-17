import React, { Component } from 'react';
import { Form, Button, Tabs, Tab } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import './Login.css'

class Login extends Component {

  state = {
    redirect: false,
    email: "",
    password: "",
    controlPassword: ""
  }

  setRedirect = () => {
    this.setState({ redirect: true });
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

  handlePasswordChange = event => {
    this.setState({
      password: event.target.value
    })
  }

  handPasswordControlChange = event => {
    this.setState({
      controlPassword: event.target.value
    })
  }

  handleLogin = event => {
    event.preventDefault();
    console.log('email: ', this.state.email);
    console.log('password: ', this.state.password)
    this.setRedirect();
  }

  handleSignup = event => {
    event.preventDefault();
    console.log('email: ', this.state.emai);
    console.log('pw: ', this.state.password);
    console.log('controlpw: ', this.state.controlPassword);
    console.log(process.env.PW_SALT);
    //send req to backend to check for emai
    //if email exists in accessors, send signup request with hashed pw
  }
  async digestPassword(password) {
    const pwUint8 = new TextEncoder().encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', pwUint8);
    const hashArray = await Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
  }
  render() {
    return (
      <Tabs defaultActiveKey="login" id="auth-tab">
        <Tab eventKey="login" title="Login">
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
        </Tab>
        <Tab eventKey="signup" title="Sign Up">
          <div className="SignUpForm">
            {this.renderRedirect()}
            <h2 className="SignUpHeader">CovidState Sign Up</h2>
            <Form>
              <Form.Group controlId="formSignupEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control type="email" placeholder="Enter email" onChange={this.handleEmailChange} />
              </Form.Group>
              <Form.Group controlId="formSignupPassword">
                <Form.Label>Enter password</Form.Label>
                <Form.Control type="password" placeholder="Password" onChange={this.handlePasswordChange} />
              </Form.Group>
              <Form.Group controlId="formSignupControlPassword">
                <Form.Label>Enter password again</Form.Label>
                <Form.Control type="password" placeholder="Password" onChange={this.handPasswordControlChange} />
              </Form.Group>
              <Button variant="primary" type="submit" onClick={this.handleSignup}>
                Sign Up
              </Button>
            </Form>
          </div>
        </Tab>
      </Tabs>
    )
  }
}

export default Login;