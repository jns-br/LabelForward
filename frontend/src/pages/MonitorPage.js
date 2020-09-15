import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import ClfMonitor from '../components/ClfMonitor';
import LabelMonitor from '../components/LabelMonitor';
import Navigation from '../components/Navigation';
import AuthService from '../services/AuthService';
import MonitorService from '../services/MonitorService';

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
    } catch (err) {
      console.log(err.message);
      this.setState({ redirect: true});
    }
  }

  async fetchClfData() {
    try {
      const clfData = await MonitorService.getClfData();
      this.setState({ clfArray: clfData});
    } catch (err) {
      console.error(err.message);
    }
  }

  async fetchLabelShare() {
    try {
      const labelShare = await MonitorService.getLabelShare();
      this.setState({ labelShare: labelShare});
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
          <ClfMonitor clfs={this.state.clfArray} />
          <br />
          <LabelMonitor labelShare={this.state.labelShare} />
        </div>
      </div>
    )
  }
}

export default Monitor;