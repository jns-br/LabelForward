import React, { Component } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Redirect } from 'react-router-dom'
import Navigation from './Navigation';
import '../styles/Tweet.css';
import axios from 'axios';
import AuthService from '../services/AuthService';

class TweetModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: false,
      tweet: "",
      labels: ['label'],
      selectedLabel: ""
    }
  }

  async componentDidMount() {
    try {
      await AuthService.checkToken();
      await this.fetchLables();
      await this.fetchTweet();
    } catch (err) {
      console.log(err.message);
      this.setState({redirect: true});
    }
  }

  async fetchLables() {
    try {
      const labels = await axios.get('/api/tweets/labels');
      this.setState({ labels: labels.data.labels });
    } catch (err) {
      console.error(err.message);
    }
  }

  async fetchTweet() {
    try {
      const tweet = await axios.get('/api/tweets/tweet');
      this.setState({ tweet: tweet.data.tweet });
    } catch (err) {
      console.error(err.message);
    }
  }

  renderRedirect = () => {
    if (this.state.redirect) {
      return <Redirect to='/' />;
    }
  }

  handleSubmit = async event =>   {
    event.preventDefault();
    try {
      await axios.post('/api/tweets/tweet', {
        tweet: this.state.tweet,
        label: this.state.selectedLabel
      });
      await this.fetchTweet();
    } catch (err) {
      console.error(err.message);
    }
  }

  handleIgnore = async event => {
    event.preventDefault();
    try {
      await this.fetchTweet();
    } catch (err) {
      console.error(err.message);
    }
  }

  handleReturn = event => {
    event.preventDefault();
    return;
  }

  updateLabel = event => this.setState({ selectedLabel: event.target.value });

  render() {
    return (
      <div className="TweetMain">
        {this.renderRedirect()}
        <Navigation></Navigation>
        <div className='TweetModal'>
          <Tweet
            value={this.state.tweet}
          />
          <LabelForm
            value={this.state.labels}
            onSubmit={this.handleSubmit}
            onIgnore={this.handleIgnore}
            onReturn={this.handleReturn}
            onSelect={this.updateLabel}
          />
        </div>
      </div>
    )
  }
}

function Tweet(props) {
  return (
    <div className='Tweet'>
      <p>{props.value}</p>
    </div>
  )
}

class LabelForm extends Component {
  render() {
    return (
      <div>
        <Form className='LabelForm'>
        <Form.Group controlId="lableForm.ControlSelect">
          <Form.Label>Select a label</Form.Label>
          <Form.Control as="select" onChange={this.props.onSelect}>
            {
              this.props.value.map((label, index) => {
                return (<option key={index} value={label}>{label}</option>)
              })
            }
          </Form.Control>
        </Form.Group>
        <Button variant="primary" onClick={this.props.onSubmit}>Submit</Button>
        <Button variant="danger" onClick={this.props.onIgnore}>Ignore</Button>
        <Button variant="secondary" onClick={this.props.onReturn}>Previous</Button>
      </Form>
      </div>
    )
  }
}

export default TweetModal;