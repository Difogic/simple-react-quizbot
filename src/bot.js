import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ChatBot, { Loading } from 'react-simple-chatbot'
import rp from 'request-promise'

class Quizbot extends Component {
  constructor () {
    super()
    this.state = {
      steps: null
    }
  }

  async componentWillMount () {
    try {
      const steps = await this.getSteps()
      await this.setState({
        steps: steps
      })
    } catch (error) {
      await this.setState({
        steps: [{
          id: 0,
          message: 'No  internet connection'
        }]
      })
    }
  }

  async getSteps () {
    const response = await rp('https://zmeu213.unit.run/scenplaner?key=jA2zefFhS0q30Lc3YyhCaP46o0vACB3W')
    return JSON.parse(response)
  }

  render () {
    const { steps } = this.state
    return <div> {
      this.state.steps
      ? (
        <ChatBot
          steps={steps}
        />
      )
      : (
        <Loading />
      ) }
    </div>
  }
}

export default Quizbot
