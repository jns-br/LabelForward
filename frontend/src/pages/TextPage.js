import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'
import Navigation from '../components/Navigation';
import TweetCard from '../components/TweetCard';
import WaitCard from '../components/WaitComponent';
import '../styles/TextPage.css';
import AuthService from '../services/AuthService';
import TextService from '../services/TextService';

class Text extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: false,
      text: "",
      text_id: 0,
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
      const labels = await TextService.getLabels();
      this.setState({ labels: labels.data.labels });
    } catch (err) {
      console.error(err.message);
    }
  }

  async fetchTweet() {
    try {
      const text = await TextService.getTweet();
      if (tweet.status === 200) {
        this.setState({ available: true});
        this.setState({ text: text.data.text, text_id: text.data.text_id });
      } else {
        this.setState({ available: false})
      }
    } catch (err) {
      console.error(err.message);
    }
  }

  getTweet = event => {
    window.location.reload();
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
      const result = await TextService.postTweet(this.state.selectedLabel, this.state.text_id)
      if (result.status === 204) {
        this.setState({ available : false});
      } else {
        await this.fetchTweet();
        this.setState({ selectedLabel: ""});
      }
    } catch (err) {
      console.error(err.message);
    }
  }

  handleIgnore = async event => {
    event.preventDefault();
    try {
      this.setState({
        selectedLabel: ""
      });
      const result = await TextService.postTweet("ignored", this.state.tweet_id);
      if (result.status === 204) {
        this.setState({ available: false});
      } else {
        await this.fetchTweet();
      }
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
        <div className="TextMain">
          {this.renderRedirect()}
          <Navigation></Navigation>
          <div className="TextModal">
            <TweetCard 
              tweet={this.state.text}
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
        <div className="TextMain">
          {this.renderRedirect()}
          <Navigation></Navigation>
          <div className="TextModal">
            <WaitCard
              onFetch={this.getTweet}
            />
          </div>
        </div>
      )
    }
  }
}

export default Text;