import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom'
import './config/firebase'
import About from './About'
import Home from './Home'
import AddMatch from './Pages/AddMatch'
import Header from './components/Header'

const App: React.FC = () => (
  <Router>
    <Header>
      <Switch>
        <Route path="/about">
          <About />
        </Route>
        <Route path="/add-match">
          <AddMatch />
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </Header>
  </Router>
)

export default App
