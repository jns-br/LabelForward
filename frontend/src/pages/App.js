import React from 'react';
import Settings from './SettingsPage';
import Text from './TextPage';
import Start from './StartPage';
import {Switch, Route} from 'react-router-dom';

function App() {
  return (
    <main>
      <Switch>
        <Route path="/" component={Start} exact />
        <Route path="/home" component={Text} />
        <Route path="/settings" component={Settings} />
      </Switch>
    </main>
  );
}

export default App;
