import React, { Component } from 'react';
import { Button, Card, Form, Badge } from 'react-bootstrap';
import '../styles/TextCard.css';

class TextCard extends Component {

  render() {
    return (
      <div>
        <Card className="TextCard">
          <Card.Header as="h5">Tweet</Card.Header>
          <Card.Body>
            <Card.Text>
              {this.props.tweet}
            </Card.Text>
          </Card.Body>
        </Card>
        <Card className="SelectorCard">
          <Card.Header>
            <div>Selected Label (click label to delete)</div>
            {
              <Badge pill variant="secondary" onClick={this.props.onDeleteLabel}>{this.props.selected}</Badge>
            }
          </Card.Header>
          <Card.Body>
            <Form>
              <Form.Group>
                <Form.Label>Select a label</Form.Label>
                <Form.Control as="select" onChange={this.props.onSelect}>
                  {
                    this.props.labels.map((label, index) => {
                      return (<option key={index} value={label}>{label}</option>)
                    })
                  }
                </Form.Control>
              </Form.Group>
            </Form>
          </Card.Body>
          <Card.Footer className="ButtonFooter">
            <Button variant="primary" onClick={this.props.onSubmit} className="Buttons">Submit</Button>
            <Button variant="danger" onClick={this.props.onIgnore} className="Buttons">Ignore</Button>
          </Card.Footer>
        </Card>
      </div>
    )
  }
}

export default TextCard;