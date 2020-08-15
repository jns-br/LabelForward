import React, { Component } from 'react';
import { Form, Button } from 'react-bootstrap';
import Navigation from './Navigation';
import './Tweet.css';

class TweetModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tweet: null,
      labels: null,
      selectedLabel: null
    }
  }

  componentWillMount() {
    this.fetchLables();
    this.fetchTweet();
  }

  fetchLables() {
    const exampleLabels = ['some', 'example', 'lables'];
    this.setState({ labels: exampleLabels });
  }

  fetchTweet() {
    const exampleTweet = 'this is an example tweet'
    this.setState({ tweet: exampleTweet });
  }

  handleSubmit() {
    return;
  }

  handleIgnore() {
    return
  }

  handleReturn() {
    return;
  }

  updateLabel = event => this.setState({ selectedLabel: event.target.value });

  render() {
    return (
      <div className="TweetMain">
        <Navigation></Navigation>
        <div className='TweetModal'>
          <Tweet
            value={this.state.tweet}
          />
          <LabelForm
            value={this.state.labels}
            onSubmit={this.handleSubmit()}
            onIgnore={this.handleIgnore()}
            onReturn={this.handleReturn()}
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
        <Button variant="secondary" onClick={this.props.onReturn}>Return</Button>
      </Form>
    )
  }
}

export default TweetModal;