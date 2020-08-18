import React from 'react';
import Settings from './Settings';
import TweetModal from './Tweet';
import Start from './Start';
import {Switch, Route} from 'react-router-dom';

function App() {
  return (
    <main>
      <Switch>
        <Route path="/" component={Start} exact />
        <Route path="/home" component={TweetModal} />
        <Route path="/settings" component={Settings} />
      </Switch>
    </main>
  );
}

export default App;
