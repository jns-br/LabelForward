import React from 'react';
import Settings from './SettingsPage';
import Text from './TextPage';
import Start from './StartPage';
import Monitor from './MonitorPage';
import {Switch, Route} from 'react-router-dom';

function App() {
  return (
    <main>
      <Switch>
        <Route path="/" component={Start} exact />
        <Route path="/home" component={Text} />
        <Route path="/settings" component={Settings} />
        <Route path="/monitor" component={Monitor} />
      </Switch>
    </main>
  );
}

export default App;
