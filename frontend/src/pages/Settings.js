import React, { Component } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import Navigation from './Navigation';
import '../styles/Settings.css';
import AuthService from '../services/AuthService';



class Settings extends Component {

  state = {
    redirect: false,
    emailAlert: "",
    emailOld: "",
    emailNew: "",
    emailControl: "",
    passwordOld: "",
    passwordNew: "",
    passwordControl: ""
  }

  async componentDidMount() {
    try {
      await AuthService.checkToken();
    } catch (err) {
      console.log(err.message);
      this.setState({ redirect: true});
    }
  }

  renderRedirect = () => {
    if (this.state.redirect) {
      return <Redirect to='/' />;
    }
  }

  setEmailAlert = alert => {
    this.setState({ emailAlert: alert});
  }

  renderEmailAlert = () => {
    if(this.state.emailAlert == 'success') {
      return <Alert variant="light" className="AlertEmail" onClose={() => this.setEmailAlert("")} dismissible>
        <Alert.Heading>Email change successful</Alert.Heading>
        <hr />
        <p>
          Your email address has been updated.
        </p>
      </Alert>
    }

    if(this.state.emailAlert == 'failure') {
      return <Alert variant="light" className="AlertEmail" onClose={() => this.setEmailAlert("")} dismissible>
        <Alert.Heading>Email change unsuccessful</Alert.Heading>
        <hr />
        <p>
          Your email address has not been updated for one of the following reasons:
          <ul>
            <li>Your old email address was incorrect</li>
            <li>The new email addresses did not match</li>
            <li>Your password was incorrect</li>
          </ul>
        </p>
      </Alert>
    }
  }

  handleEmailOldChange = event => {
    this.setState({
      emailOld: event.target.value
    })
  }

  handleEmailNewChange = event => {
    this.setState({
      emailNew: event.target.value
    })
  }

  handleEmailControlChange = event => {
    this.setState({
      emailControl: event.target.value
    })
  }

  handlePasswordOldChange = event => {
    this.setState({
      passwordOld: event.target.value
    })
  }

  handlePasswordNewChange = event => {
    this.setState({
      passwordNew: event.target.value
    })
  }

  handPasswordControlChange = event => {
    this.setState({
      passwordControl: event.target.value
    })
  }

  render() {
    return (
      <div className="SettingsMain">
        {this.renderRedirect()}
        <Navigation></Navigation>
        <div className="Settings">
          <Form className="EmailForm">
            <h3>Change Email</h3>
            <Form.Group controlId="formOldEmail">
              <Form.Label>Old email</Form.Label>
              <Form.Control type="email" placeholder="Enter old email" onChange={this.handleEmailOldChange} />
            </Form.Group>
            <Form.Group controlId="formNewEmail">
              <Form.Label>New email</Form.Label>
              <Form.Control type="email" placeholder="Enter new email" onChange={this.handleEmailNewChange} />
            </Form.Group>
            <Form.Group controlId="fromNewEmailConfirm">
              <Form.Label>Confirm new email</Form.Label>
              <Form.Control type="email" placeholder="Enter new email again" onChange={this.handleEmailControlChange} />
            </Form.Group>
            <Form.Group controlId="formNewEmailPassword">
              <Form.Label>Confirm with password</Form.Label>
              <Form.Control type="password" placeholder="Enter password" onChange={this.handlePasswordOldChange} />
            </Form.Group>
            <Button variant="primary" type="submit">
              Submit
          </Button>
          </Form>

          <Form className="PasswordForm">
            <h3>Change password</h3>
            <Form.Group controlId="formNewPassword">
              <Form.Label>New password</Form.Label>
              <Form.Control type="password" placeholder="Enter new password" />
              <Form.Text>Password must be at least 8 characters long</Form.Text>
            </Form.Group>
            <Form.Group controlId="formNewPasswordConfirm">
              <Form.Label>Confirm new password</Form.Label>
              <Form.Control type="password" placeholder="Enter new password again" />
            </Form.Group>
            <Form.Group controlId="formOldPassword">
              <Form.Label>Old password</Form.Label>
              <Form.Control type="password" placeholder="Enter old password" />
            </Form.Group>
            <Button variant="primary" type="submit">Submit</Button>
          </Form>
        </div>
      </div>
    )
  }
}

export default Settings;