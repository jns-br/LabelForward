import React, { Component } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import Navigation from '../components/Navigation';
import '../styles/Settings.css';
import AuthService from '../services/AuthService';
import UserService from '../services/UserService';



class Settings extends Component {

  state = {
    redirect: false,
    emailAlert: "",
    emailNew: "",
    emailControl: "",
    passwordAlert: "",
    passwordOld: "",
    passwordNew: "",
    passwordControl: ""
  }

  async componentDidMount() {
    try {
      await AuthService.checkToken();
    } catch (err) {
      console.log(err.message);
      this.setState({ redirect: true });
    }
  }

  renderRedirect = () => {
    if (this.state.redirect) {
      return <Redirect to='/' />;
    }
  }

  setPasswordAlert = alert => {
    this.setState({ passwordAlert: alert });
  }

  setEmailAlert = alert => {
    this.setState({ emailAlert: alert });
  }

  renderPasswordAlert = () => {
    if (this.state.passwordAlert === 'success') {
      return <Alert variant="light" className="AlertPassword" onClose={() => this.setPasswordAlert("")} dismissible>
        <Alert.Heading>Password change successful</Alert.Heading>
        <hr />
        <p>
          Your password has been updated.
        </p>
      </Alert>
    }

    if (this.state.passwordAlert === 'failure') {
      return <Alert variant="light" className="AlterPassword" onClose={() => this.setPasswordAlert("")} dismissible>
        <Alert.Heading>Password change unsuccessful</Alert.Heading>
        <hr />
        <div>
          <p>Your password has not been updated for one of the following reasons:</p>
          <ul>
            <li>Your old password was incorrect</li>
            <li>The new passwords did not match</li>
          </ul>
        </div>
      </Alert>
    }
  }

  renderEmailAlert = () => {
    if (this.state.emailAlert === 'success') {
      return <Alert variant="light" className="AlertEmail" onClose={() => this.setEmailAlert("")} dismissible>
        <Alert.Heading>Email change successful</Alert.Heading>
        <hr />
        <p>
          Your email address has been updated.
        </p>
      </Alert>
    }

    if (this.state.emailAlert === 'failure') {
      return <Alert variant="light" className="AlertEmail" onClose={() => this.setEmailAlert("")} dismissible>
        <Alert.Heading>Email change unsuccessful</Alert.Heading>
        <hr />
        <div>
          <p>Your email address has not been updated for one of the following reasons:</p>
          <ul>
            <li>Your old email address was incorrect</li>
            <li>The new email addresses did not match</li>
            <li>Your password was incorrect</li>
          </ul>
        </div>
      </Alert>
    }
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

  handlePasswordControlChange = event => {
    this.setState({
      passwordControl: event.target.value
    })
  }

  handleEmailSubmission = async event => {
    event.preventDefault();
    if (this.state.emailNew !== this.state.emailControl) {
      this.setEmailAlert('failure');
      this.resertEmailForm();
      return;
    }

    try {
      await UserService.updateEmail(this.state.emailNew, this.state.passwordOld);
      this.resertEmailForm();
      this.setEmailAlert('success')
    } catch (err) {
      console.error(err.message);
      this.setEmailAlert('failure')
    }
  }

  handlePasswordSubmission = async event => {
    event.preventDefault();
    if(this.state.passwordNew !== this.state.passwordControl) {
      this.setPasswordAlert('failure');
      this.resetPasswordForm();
      return;
    }

    try {
      await UserService.updatePassword(this.state.passwordOld, this.state.passwordNew);
      this.resetPasswordForm();
      this.setPasswordAlert('success');
    } catch (err) {
      console.error(err.message);
      this.setPasswordAlert('failure');
    }
  }

  resetPasswordForm = () => {
    document.getElementById('pw-form').reset();
  }

  resertEmailForm = () => {
    document.getElementById('email-form').reset();
  }

  render() {
    return (
      <div className="SettingsMain">
        {this.renderRedirect()}
        <Navigation></Navigation>
        <div className="Settings">
          {this.renderEmailAlert()}
          {this.renderPasswordAlert()}
          <Form className="EmailForm" id="email-form">
            <h3>Change Email</h3>
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
            <Button variant="primary" type="submit" onClick={this.handleEmailSubmission}>
              Submit
          </Button>
          </Form>

          <Form className="PasswordForm" id="pw-form">
            <h3>Change password</h3>
            <Form.Group controlId="formNewPassword">
              <Form.Label>New password</Form.Label>
              <Form.Control type="password" placeholder="Enter new password" onChange={this.handlePasswordNewChange}/>
              <Form.Text>Password must be at least 8 characters long</Form.Text>
            </Form.Group>
            <Form.Group controlId="formNewPasswordConfirm">
              <Form.Label>Confirm new password</Form.Label>
              <Form.Control type="password" placeholder="Enter new password again" onChange={this.handlePasswordControlChange} />
            </Form.Group>
            <Form.Group controlId="formOldPassword">
              <Form.Label>Old password</Form.Label>
              <Form.Control type="password" placeholder="Enter old password" onChange={this.handlePasswordOldChange}/>
            </Form.Group>
            <Button variant="primary" type="submit" onClick={this.handlePasswordSubmission}>Submit</Button>
          </Form>
        </div>
      </div>
    )
  }
}

export default Settings;