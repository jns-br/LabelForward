import React from 'react';
import Settings from './Settings';
import TweetModal from './Tweet';
import Login from './Login';
import {Switch, Route} from 'react-router-dom';

function App() {
  return (
    <main>
      <Switch>
        <Route path="/" component={Login} exact />
        <Route path="/home" component={TweetModal} />
        <Route path="/settings" component={Settings} />
      </Switch>
    </main>
  );
}

export default App;
