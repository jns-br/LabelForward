import React, { Component } from 'react';
import { Table } from 'react-bootstrap';

class ClfMonitor extends Component {
  render() {
    return (
      <Table striped bordered hover>
        <thead>
          <th>Classifier</th>
          <th>Precision</th>
          <th>Created at</th>
        </thead>
        <tbody>
          {this.props.clfs.map((value, index) => {
            return (<tr>
              <td key={index}>{value.clfId}</td>
              <td key={index}>{value.precision}</td>
              <td key={index}>{value.timestamp}</td>
            </tr>)
          })}
        </tbody>
      </Table>
    )
  }
}

export default ClfMonitor;