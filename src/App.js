import React, { Component } from 'react'
import logo from './logo.svg'
import './App.css'
import Quizbot from './bot'

class App extends Component {
  render () {
    return (
      <div className='App animated fadeIn'>
        <h1><i className='fa fa-search' /> Simple react quizbot</h1>
        <Quizbot />
        <footer>
          <div className='u-pull-right links'>
            Powered by
            <a href='https://unitcluster.com/' target='blank'>UnitCluster</a>
          </div>
        </footer>
      </div>
    )
  }
}

export default App
