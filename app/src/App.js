import React, { Component } from 'react'
import Header from './components/Header/Header.js'
import Nav from './components/Nav/Nav.js'
import './App.css'
import { Router } from '@reach/router'
import Home from './pages/Home/Home.js'
import CamperList from './pages/CamperList/CamperList.js'
import TestManager from './pages/TestManager/TestManager.js'

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header />
        <Nav />
        <Router>
          <Home path="/" />
          <CamperList path="camper_list" />
          <TestManager path="test_manager" />
        </Router>
      </div>
    )
  }
}

export default App
