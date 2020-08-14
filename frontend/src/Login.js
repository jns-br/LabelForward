import React, { Component } from 'react';
import { Form, Button } from 'react-bootstrap';
import './Login.css'

class Login extends Component {

  handleLogin = event => {
    event.preventDefault();
    console.log(event.target);
  }

  render() {
    return (
      <div className="LoginForm">
        <h2 className="LoginHeader">CovidState</h2>
        <Form>
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control type="email" placeholder="Enter email" />
          </Form.Group>
          <Form.Group controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Password" />
          </Form.Group>
          <Button variant="primary" type="submit">
            Submit
        </Button>
        </Form>
      </div>
    )
  }
}

export default Login;