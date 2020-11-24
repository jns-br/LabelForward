import { Component } from 'react';
import { Card } from 'react-bootstrap';

class CompleteCard extends Component {
  render() {
    return (
      <div>
        <Card className="CompleteCard">
          <Card.Body>
            You have labeled all available datapoints
          </Card.Body>
        </Card>
      </div>
    )
  }
}

export default CompleteCard;