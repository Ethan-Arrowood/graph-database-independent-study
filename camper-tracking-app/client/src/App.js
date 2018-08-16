import React, { Component } from 'react'
import Header from './components/Header/Header.js'
import Nav from './components/Nav/Nav.js'
import './App.css'
import { Router } from '@reach/router'
import Home from './pages/Home/Home.js'
import CamperList from './pages/CamperList/CamperList.js'
import TestManager from './pages/TestManager/TestManager.js'
import 'react-select/dist/react-select.css'
import 'react-virtualized/styles.css'

const campers = [
  { name: 'Ethan Arrowood' },
  { name: 'Alex Arrowood' },
  { name: 'Billy Bob' },
  { name: 'John Jones' },
  { name: 'Oswald Orlando' },
]

const tests = [
  { name: 'Firebuilding' },
  { name: 'Knife Test' },
  { name: 'Shelter' },
  { name: 'Knots' },
  { name: '2 Trip Points' },
  { name: 'Hiking Skills' },
]

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header />
        <Nav />
        <Router className="App-router" style={{ flexGrow: 2 }}>
          <Home path="/" />
          <CamperList path="camper_list" />
          <TestManager path="test_manager" campers={campers} tests={tests} />
        </Router>
      </div>
    )
  }
}

export default App
