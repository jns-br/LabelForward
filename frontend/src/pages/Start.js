import React, { Component } from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import SignUp from './SignUp';
import Login from './Login';

class Start extends Component {

  render() {
    return (
     <Tabs defaultActiveKey="login" id="auth-tab">
       <Tab eventKey="login" title="Login">
        <Login></Login>
       </Tab>
       <Tab eventKey="signup" title="Sign up">
        <SignUp></SignUp>
       </Tab>
     </Tabs> 
    )
  }
}

export default Start;