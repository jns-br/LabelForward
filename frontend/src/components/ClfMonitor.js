import React, { Component } from 'react';
import { Button, Table } from 'react-bootstrap';

class ClfMonitor extends Component {

  rederButton = (clfId, downloadState, reqHandler, dlHandler) => {
    const state = parseInt(downloadState);
    if(state === 0) {
      return (<Button id={clfId} variant="primary" onClick={reqHandler}>Request DL</Button>)
    } else if (state === 1) {
      return (<Button id={clfId} variant="secondary" disabled>Processing DL</Button>)
    } else {
      return(<Button id={clfId} variant="primary" onClick={dlHandler}>Download</Button>)
    }
  };

  render() {
    return (
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Classifier</th>
            <th>Precision</th>
            <th>Created at</th>
            <th>Download</th>
          </tr>
        </thead>
        <tbody>
          {this.props.clfs.map((value, index) => {
            return (<tr>
              <td key={index}>{value.clfId}</td>
              <td key={index}>{value.precision}</td>
              <td key={index}>{value.timestamp}</td>
              <td key={index}>{this.rederButton(value.clfId, value.download, this.props.reqHandler, this.props.dlHandler)}</td>
            </tr>)
          })}
        </tbody>
      </Table>
    )
  }
}

export default ClfMonitor;