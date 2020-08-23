import React, { Component } from 'react';
import { From, Button, Card, Form } from 'react-bootstrap';

class TweetCard extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="TweetCard">
        <Card>
          <Card.Header as="h5">CovidState</Card.Header>
          <Card.Body>
            <Card.Text>
              {this.props.tweet}
            </Card.Text>
          </Card.Body>
        </Card>
        <br />
        <Card>
          <Card.Header>Selected labels should go here</Card.Header>
          <Card.Body>
            <Form>
              <From.Group>
                <Form.Label>Select a label</Form.Label>
                <Form.Control as="select" onChange={this.props.onSelect}>
                  {
                    this.props.labels.map((label, index) => {
                      return (<option key={index} value={label}>{label}</option>)
                    })
                  }
                </Form.Control>
              </From.Group>
            </Form>
          </Card.Body>
          <Card.Footer>
            <Button variant="primary" onClick={this.props.onSubmit}>Submit</Button>
            <Button variant="danger" onClick={this.props.onIgnore}>Ignore</Button>
          </Card.Footer>
        </Card>
      </div>
    )
  }
}

export default TweetCard;