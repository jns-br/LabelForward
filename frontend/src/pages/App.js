import React from 'react';
import Settings from './SettingsPage';
import TweetModal from './TweetPage';
import Start from './StartPage';
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
