import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Tab, Tabs } from 'react-bootstrap';
import SignUp from './SignUp';
import Login from './Login';
import AuthService from '../services/AuthService';

class Start extends Component {

  state = {
    redirect: false
  };

  renderRediret = () => {
    if (this.state.redirect) {
      return <Redirect to='/home' />;
    }
  }

  async componentDidMount() {
    try {
      await AuthService.checkToken();
      this.setState({ redirect: true });
    } catch (err) {
      console.log(err.message)
    }
  }

  render() {
    return (
      <div>
        {this.renderRediret()}
        <Tabs defaultActiveKey="login" id="auth-tab">
          <Tab eventKey="login" title="Login">
            <Login></Login>
          </Tab>
          <Tab eventKey="signup" title="Sign up">
            <SignUp></SignUp>
          </Tab>
        </Tabs>
      </div>
    )
  }
}

export default Start;