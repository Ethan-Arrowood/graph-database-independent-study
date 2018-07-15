import React from 'react'
import viking from './viking.svg'
import './Header.css'

class Header extends React.Component {
  render() {
    return (
      <header className="App-header">
        <img src={viking} className="App-logo" alt="logo" />
        <h1 className="App-title">Camper Test Tracker</h1>
        <h2 className="App-subtitle">created by Ethan Arrowood</h2>
      </header>
    )
  }
}

export default Header
