import React, { Component } from 'react';
import { Card } from 'react-bootstrap'

class LabelMonitor extends Component {
  render() {
    return (
      <Card>
        <Card.Header>Labeled Data</Card.Header>
        <Card.Body>{this.props.labelShare}% of all datapoints have been labeled by humans</Card.Body>
      </Card>
    )
  }
}

export default LabelMonitor;