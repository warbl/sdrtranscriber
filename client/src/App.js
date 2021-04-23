import React from 'react'
import Home from './components/homePage/home';
import Music from './components/musicSection/musicSection'
import NavBar from './components/navBar/navbar'
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import News from './components/newsSection/newsSection';
import Radio from './components/radioSection/radio';
import TopSongs from './components/topSongs/topSongs';

function App() {
  return (
    <Router>
    <div className="App">
       <NavBar />
      <Switch>
      <Route exact path='/' component = {Home} />
      <Route path='/music' component = {Music} />
      <Route path='/news' component = {News} />
      <Route path='/radio' component = {Radio} />
      <Route path='/topSongs' component = {TopSongs} />
      </Switch>
    </div>
    </Router>
  );
}
export default App;
