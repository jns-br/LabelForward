import React, { Component } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Redirect} from 'react-router-dom';
import './Login.css'

class Login extends Component {

  state = {
    redirect: false,
    email: "",
    password:""
  }

  setRedirect = () => {
    this.setState({redirect: true});
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

  handleLogin = event => {
    console.log('email: ', this.state.email);
    console.log('password: ', this.state.password)
    this.setRedirect();
  }

  render() {
    return (
      <div className="LoginForm">
        {this.renderRedirect()}
        <h2 className="LoginHeader">CovidState</h2>
        <Form>
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control type="email" placeholder="Enter email" onChange={this.handleEmailChange}/>
          </Form.Group>
          <Form.Group controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Password" onChange={this.handlePasswordChange}/>
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