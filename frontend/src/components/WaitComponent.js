import React, { Component } from 'react';
import {Button, Card} from 'react-bootstrap';
import '../styles/WaitCard.css'

class WaitCard extends Component {
  render() {
    return (
      <div>
        <Card className="WaitCard">
          <Card.Body>
            <Card.Text>
              Waiting for new tweets...
            </Card.Text>
          </Card.Body>
          <Card.Footer className="WaitFooter">
            <Button variant="primary" onClick={this.props.onFetch}>Try again</Button>
          </Card.Footer>
        </Card>
      </div>
    )
  }
}

export default WaitCard;