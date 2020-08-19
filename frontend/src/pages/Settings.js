import React, { Component } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import Navigation from './Navigation';
import '../styles/Settings.css';
import AuthService from '../services/AuthService';



class Settings extends Component {

  state = {
    redirect: false
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

  render() {
    return (
      <div className="SettingsMain">
        {this.renderRedirect()}
        <Navigation></Navigation>
        <div className="Settings">
          <Form className="EmailForm">
            <h3>Change Email</h3>
            <Form.Group controlId="formNewEmail">
              <Form.Label>New email</Form.Label>
              <Form.Control type="email" placeholder="Enter new email" />
            </Form.Group>
            <Form.Group controlId="fromNewEmailConfirm">
              <Form.Label>Confirm new email</Form.Label>
              <Form.Control type="email" placeholder="Enter new email again"></Form.Control>
            </Form.Group>
            <Form.Group controlId="formNewEmailPassword">
              <Form.Label>Confirm with password</Form.Label>
              <Form.Control type="password" placeholder="Enter password"></Form.Control>
            </Form.Group>
            <Button variant="primary" type="submit">
              Submit
          </Button>
          </Form>

          <Form className="PasswordForm">
            <h3>Change password</h3>
            <Form.Group controlId="formNewPassword">
              <Form.Label>New password</Form.Label>
              <Form.Control type="password" placeholder="Enter new password"></Form.Control>
              <Form.Text>Password must be at least 8 characters long</Form.Text>
            </Form.Group>
            <Form.Group controlId="formNewPasswordConfirm">
              <Form.Label>Confirm new password</Form.Label>
              <Form.Control type="password" placeholder="Enter new password again"></Form.Control>
            </Form.Group>
            <Form.Group controlId="formOldPassword">
              <Form.Label>Old password</Form.Label>
              <Form.Control type="password" placeholder="Enter old password"></Form.Control>
            </Form.Group>
            <Button variant="primary" type="submit">Submit</Button>
          </Form>
        </div>
      </div>
    )
  }
}

export default Settings;