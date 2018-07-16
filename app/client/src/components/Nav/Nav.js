import React from 'react'
import './Nav.css'

import { Link } from '@reach/router'

class Nav extends React.Component {
  render() {
    return (
      <nav className="App-nav">
        <Link className="App-nav-link" to="/">
          /home
        </Link>
        <Link className="App-nav-link" to="/camper_list">
          /camper_list
        </Link>
        <Link className="App-nav-link" to="/test_manager">
          /test_manager
        </Link>
      </nav>
    )
  }
}

export default Nav
