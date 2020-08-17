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
    console.log('email: ', this.state.email);
    console.log('password: ', this.state.password)
    this.setRedirect();
  }

  handleSignup = event => {
    console.log('email: ', this.state.emai);
    console.log('pw: ', this.state.password);
    console.log('controlpw: ', this.state.controlPassword);
    //send req to backend to check for emai
    //if email exists in accessors, send signup request with hashed pw
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
              <Form.Group controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control type="email" placeholder="Enter email" onChange={this.handleEmailChange} />
              </Form.Group>
              <Form.Group controlId="formBasicPassword">
                <Form.Label>Enter password</Form.Label>
                <Form.Control type="password" placeholder="Password" onChange={this.handlePasswordChange} />
              </Form.Group>
              <Form.Group controlId="formBasicControlPassword">
                <Form.Label>Enter password again</Form.Label>
                <Form.Control type="password" placeholder="Password" onChange={this.handPasswordControlChange} />
              </Form.Group>
              <Button variant="primary" type="submit" onClick={this.handleLogin}>
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