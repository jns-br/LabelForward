import React, { Component } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';

class SignUp extends Component {
  state = {
    redirect: false,
    email: "",
    password: "",
    controlPassword: "",
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

  renderAlertRegisterSuccess = () => {
    if (this.state.alert === 'success') {
      return <Alert variant="light" className="AlertRegister" onClose={() => this.setAlert("")} dismissible>
        <Alert.Heading>Welcome to CovidState</Alert.Heading>
        <hr />
        <p>
          You can now log in to the CovidStateApp.
        </p>
      </Alert>
    }
  }

  renderAlertRegisterFailure = () => {
    if (this.state.alert === 'failure') {
      return <Alert variant="light" className="AlertRegister" onClose={() => this.setAlert("")} dismissible>
        <Alert.Heading>Not Authorized</Alert.Heading>
        <hr />
        <p>
          The email you are trying to register with was not authorized.
        </p>
      </Alert>
    }
  }

  handlePasswordChange = async event => {
    const crypto_pw = await this.digestPassword(event.target.value);
    this.setState({
      password: crypto_pw
    })
  }

  handPasswordControlChange = async event => {
    const crypto_pw = await this.digestPassword(event.target.value);
    this.setState({
      controlPassword: crypto_pw
    })
  }

  handleSignup = event => {
    event.preventDefault();
    console.log('email: ', this.state.emai);
    console.log('pw: ', this.state.password);
    console.log('controlpw: ', this.state.controlPassword);
    //send req to backend to check for emai
    //if email exists in accessors, send signup request with hashed pw
    this.setAlert('success');
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
      <div className="SignUpForm">
        {this.renderAlertRegisterSuccess()}
        {this.renderAlertRegisterFailure()}
        <h2 className="SignUpHeader">CovidState Registration</h2>
        <Form>
          <Form.Group controlId="formSignupEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control type="email" placeholder="Enter email" onChange={this.handleEmailChange} />
          </Form.Group>
          <Form.Group controlId="formSignupPassword">
            <Form.Label>Enter password</Form.Label>
            <Form.Control type="password" placeholder="Password" onChange={this.handlePasswordChange} />
            <Form.Text>Password must be at least 8 characters long and contain upper and lowercase letters, at least one number and at least one symbol(!?+).</Form.Text>
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
    )
  }
}

export default SignUp;