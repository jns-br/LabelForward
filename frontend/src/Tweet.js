import React, { Component } from 'react';

class TweetModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tweet:'This is a sample tweet and it should be a little longer',
      labels: [],
      selectedLabel: null
    }
  }

  render() {
    return(
      <div className='tweetmodal'>
        <div className='tweet'>
          <Tweet 
            value={this.state.tweet}
          />
        </div>
      </div>
    )
  }
}

function Tweet(props) {
  return (
    <div className='tweet'>
      <p>{props.value}</p>
    </div>
  )
}