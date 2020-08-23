import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'
import Navigation from '../components/Navigation';
import TweetCard from '../components/TweetCard';
import '../styles/TweetPage.css';
import axios from 'axios';
import AuthService from '../services/AuthService';

class TweetModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: false,
      tweet: "",
      labels: ['label'],
      selectedLabel: []
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
        label: this.state.selectedLabel[0]
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

  updateLabel = event => this.setState({ selectedLabel: this.state.selectedLabel.concat([event.target.value]) });

  deleteLabel = event => {
    console.log(event.target.innerHTML)
    const removed = this.state.selectedLabel.filter(label => label !== event.target.innerHTML);
    this.setState({ selectedLabel: removed});
    console.log(this.state.selectedLabel);
  }

  render() {
    return (
      <div className="TweetMain">
        {this.renderRedirect()}
        <Navigation></Navigation>
        <div className='TweetModal'>
          <TweetCard 
            tweet={this.state.tweet}
            labels={this.state.labels}
            selected={this.state.selectedLabel}
            onSubmit={this.handleSubmit}
            onIgnore={this.handleIgnore}
            onSelect={this.updateLabel}
            onDeleteLabel={this.deleteLabel}
          />
        </div>
      </div>
    )
  }
}

export default TweetModal;