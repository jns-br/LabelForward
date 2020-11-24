import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'
import Navigation from '../components/Navigation';
import TweetCard from '../components/TextCard';
import WaitCard from '../components/WaitComponent';
import CompleteCard from '../components/CompleteComponent'
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
      available: false,
      completed: false
    }
  }

  async componentDidMount() {
    try {
      await AuthService.checkToken();
      await this.fetchLables();
      await this.fetchText();
    } catch (err) {
      console.log(err.message);
      this.setState({redirect: true});
    }
  }

  async fetchLables() {
    try {
      const startArray = [];
      const labels = await TextService.getLabels();
      const concatArray = startArray.concat(labels.data.labels);
      this.setState({ labels: concatArray });
      this.setState({ selectedLabel: concatArray[0]});
    } catch (err) {
      console.error(err.message);
    }
  }

  async fetchText() {
    try {
      const text = await TextService.getText();
      if (text.status === 200) {
        this.setState({ available: true});
        this.setState({ text: text.data.text, text_id: text.data.text_id });
      } else if (text.status === 205){
        this.setState({ available: false});
        this.setState({ completed: true });
      } else {
        this.setState({ available: false});
      }
    } catch (err) {
      console.error(err.message);
    }
  }

  getText = event => {
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
      const result = await TextService.postText(this.state.selectedLabel, this.state.text_id)
      if (result.status === 204) {
        this.setState({ available : false});
      } else {
        await this.fetchText();
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
      const result = await TextService.postText("ignored", this.state.text_id);
      if (result.status === 204) {
        this.setState({ available: false});
      } else {
        await this.fetchText();
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
      if (this.state.completed) {
        return (
          <div className="TextMain">
            {this.renderRedirect()}
            <Navigation></Navigation>
            <div className="TextModal">
              <CompleteCard></CompleteCard>
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
                onFetch={this.getText}
              />
            </div>
          </div>
        )
      }
    }
  }
}

export default Text;