import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'
import Navigation from '../components/Navigation';
import TweetCard from '../components/TweetCard';
import '../styles/TweetPage.css';
import AuthService from '../services/AuthService';
import TweetService from '../services/TweetService';

class TweetModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: false,
      tweet: "",
      labels: ['label'],
      selectedLabels: []
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
      const labels = await TweetService.getLabels();
      this.setState({ labels: labels.data.labels });
    } catch (err) {
      console.error(err.message);
    }
  }

  async fetchTweet() {
    try {
      const tweet = await TweetService.getTweet();
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
      await TweetService.postTweet(this.state.tweet, this.state.selectedLabels)
      await this.fetchTweet();
      this.setState({ selectedLabels: []});
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

  updateLabel = event => {
    if (!this.state.selectedLabels.includes(event.target.value)) {
      this.setState({ selectedLabels: this.state.selectedLabels.concat([event.target.value]) });
    }
  }

  deleteLabel = event => {
    const removed = this.state.selectedLabels.filter(label => label !== event.target.innerHTML);
    this.setState({ selectedLabels: removed});
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
            selected={this.state.selectedLabels}
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