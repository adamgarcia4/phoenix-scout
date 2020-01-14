import React from 'react'
import {
  BrowserRouter as Router, Switch, Route, Link,
} from 'react-router-dom'
import firebase from 'firebase'
import About from './About'
import Home from './Home'
import AddMatch from './Pages/AddMatch'

console.log('process.env:',process.env)

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  // storageBucket: 'phoenix-scout.appspot.com',
  // messagingSenderId: '580316896025',
  // appId: '1:580316896025:web:ea44efaf12454f4a868388',
  // measurementId: 'G-LFVMWJJK1S',
}

console.log('firebaseConfig:',firebaseConfig)


// const firebaseConfig = {
//   apiKey: 'AIzaSyCxaVqcn68DaxVti4_FLvNJVEEUSs0MmLk',
//   authDomain: 'phoenix-scout.firebaseapp.com',
//   databaseURL: 'https://phoenix-scout.firebaseio.com',
//   projectId: 'phoenix-scout',
//   storageBucket: 'phoenix-scout.appspot.com',
//   messagingSenderId: '580316896025',
//   appId: '1:580316896025:web:ea44efaf12454f4a868388',
//   measurementId: 'G-LFVMWJJK1S',
// }

firebase.initializeApp({
  apiKey: "AIzaSyCxaVqcn68DaxVti4_FLvNJVEEUSs0MmLk",
  authDomain: "phoenix-scout.firebaseapp.com",
  databaseURL: "https://phoenix-scout.firebaseio.com",
  projectId: "phoenix-scout",
  storageBucket: "phoenix-scout.appspot.com",
  messagingSenderId: "580316896025",
  appId: "1:580316896025:web:ea44efaf12454f4a868388",
  measurementId: "G-LFVMWJJK1S"
})
// firebase.initializeApp(firebaseConfig)


firebase.firestore().collection('matches').onSnapshot((docs) => {
  docs.docs.map((doc) => {
    console.log('doc:', doc.data())
  })
})

const App: React.FC = () => (
  <Router>
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/add-match">Add Match</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>
      </ul>
    </nav>
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
  </Router>
)

export default App
