import React, { Component } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import UserService from '../services/UserService';

class SignUp extends Component {
  state = {
    redirect: false,
    email: "",
    password: "",
    controlPassword: "",
    alert: "",
    pwAlert: false
  }

  setRedirect = () => {
    this.setState({ redirect: true });
  }

  setAlert = alert => {
    this.setState({ alert: alert });
  }

  setPwAlert = () => {
    this.setState({pwAlert: !this.state.pwAlert});
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

  renderAlertPassword = () => {
    if (this.state.pwAlert === true) {
      return <Alert variant="light" className="AlertPW" onClose={() => this.setPwAlert()} dismissible>
        <Alert.Heading>Password not matching</Alert.Heading>
        <hr />
        <p>
          The password you chose and the control password must match.
        </p>
      </Alert>
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

  handleSignup = async event => {
    event.preventDefault();
    if(this.state.password !== this.state.controlPassword) {
      this.setPwAlert();
      this.setState({
        password: "",
        controlPassword: ""
      });
      return;
    }

    try {
      await UserService.register(this.state.email, this.state.password);
      this.setAlert('success');
    } catch (err) {
      if(err.response) {
        console.log(err.response.status)
        if(err.response.status === 403) {
          this.setAlert('failure');
        }
      }
      console.error(err.message);
    }
  }

  render() {
    return (
      <div className="SignUpForm">
        {this.renderAlertRegisterSuccess()}
        {this.renderAlertRegisterFailure()}
        {this.renderAlertPassword()}
        <h2 className="SignUpHeader">CovidState Registration</h2>
        <Form>
          <Form.Group controlId="formSignupEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control type="email" placeholder="Enter email" onChange={this.handleEmailChange} />
            <Form.Text>Enter the email address the was registered as an accessor email</Form.Text>
          </Form.Group>
          <Form.Group controlId="formSignupPassword">
            <Form.Label>Choose password</Form.Label>
            <Form.Control type="password" placeholder="Password" onChange={this.handlePasswordChange} />
            <Form.Text>Password must be at least 8 characters long and contain at least one of the following: lower case letter, upper case letter, digit</Form.Text>
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