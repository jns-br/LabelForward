import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import ClfMonitor from '../components/ClfMonitor';
import LabelMonitor from '../components/LabelMonitor';
import Navigation from '../components/Navigation';
import AuthService from '../services/AuthService';
import MonitorService from '../services/MonitorService';
import '../styles/MonitorPage.css';

class Monitor extends Component {
  constructor(props) {
    super(props)
    this.state = {
      clfArray: [],
      labelShare:0,
      redirect: false
    }
  }

  async componentDidMount() {
    try {
      await AuthService.checkToken();
      await this.fetchClfData();
      await this.fetchLabelShare();
    } catch (err) {
      console.log(err.message);
      this.setState({ redirect: true});
    }
  }

  async fetchClfData() {
    try {
      const result = await MonitorService.getClfData();
      const data = Array.from(result.clfData);
      this.setState({ clfArray: data});
    } catch (err) {
      console.error(err.message);
    }
  }

  async fetchLabelShare() {
    try {
      const result = await MonitorService.getLabelShare();
      this.setState({ labelShare: result.labelShare});
    } catch (err) {
      console.error(err.message);
    }
  }

  renderRedirect = () => {
    if(this.state.redirect) {
      return <Redirect to="/" />;
    }
  }

  render() {
    return (
      <div className="MonitorMain">
        {this.renderRedirect()}
        <Navigation></Navigation>
        <div className="ClfTable">
          <LabelMonitor labelShare={this.state.labelShare} />
          <br />
          <ClfMonitor clfs={this.state.clfArray} />
        </div>
      </div>
    )
  }
}

export default Monitor;