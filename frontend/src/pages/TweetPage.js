import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'
import Navigation from '../components/Navigation';
import TweetCard from '../components/TweetCard';
import WaitCard from '../components/WaitComponent';
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
      selectedLabel: "",
      available: false
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
      if (tweet.status === 200) {
        this.setState({ available: true});
        this.setState({ tweet: tweet.data.tweet });
      } else {
        this.setState({ available: false})
      }
    } catch (err) {
      console.error(err.message);
    }
  }

  getTweet = async event => {
    await this.fetchTweet();
  }

  renderRedirect = () => {
    if (this.state.redirect) {
      return <Redirect to='/' />;
    }
  }

  handleSubmit = async event =>   {
    event.preventDefault();
    if (this.state.selectedLabel === "") {
      return;
    }
    try {
      await TweetService.postTweet(this.state.tweet, this.state.selectedLabel)
      await this.fetchTweet();
      this.setState({ selectedLabel: ""});
    } catch (err) {
      console.error(err.message);
    }
  }

  handleIgnore = async event => {
    event.preventDefault();
    try {
      this.setState({
        selectedLabel: "ignored"
      });
      await TweetService.postTweet(this.state.tweet, this.state.selectedLabel);
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
    this.setState({ selectedLabel: event.target.value})
  }

  deleteLabel = event => {
    this.setState({ selectedLabel: ""});
  }

  render() {
    if (this.state.available) {
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
    } else {
      return (
        <div className="TweetMain">
          {this.renderRedirect()}
          <Navigation></Navigation>
          <div className="TweetModal">
            <WaitCard
              onFetch={this.getTweet}
            />
          </div>
        </div>
      )
    }
  }
}

export default TweetModal;