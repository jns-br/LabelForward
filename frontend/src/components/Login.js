import React, { Component } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import AuthService from '../services/AuthService';
import '../styles/Login.css'

class Login extends Component {

  state = {
    redirect: false,
    email: "",
    password: "",
    alert: false
  }

  setRedirect = () => {
    this.setState({ redirect: !this.state.redirect });
  }

  setAlert = () => {
    this.setState({ alert: !this.state.alert });
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

  renderLoginAlert = () => {
    if (this.state.alert) {
      return <Alert variant="light" className="AlertLogin" onClose={() => this.setAlert()} dismissible>
        <Alert.Heading>Login failed</Alert.Heading>
        <hr />
        <p>
          No user with this email and/or password.
        </p>
      </Alert>
    }
  }

  handlePasswordChange = event => {
    this.setState({
      password: event.target.value
    })
  }

  handleLogin = async event => {
    event.preventDefault();
    try {
      await AuthService.login(this.state.email, this.state.password);
      this.setRedirect()
    } catch (err) {
      console.error(err.message);
      this.setAlert();
    }
  }

  render() {
    return (
      <div className="LoginForm">
        {this.renderRedirect()}
        {this.renderLoginAlert()}
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