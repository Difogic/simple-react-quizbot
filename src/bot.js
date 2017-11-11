import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ChatBot, { Loading } from 'react-simple-chatbot'
import rp from 'request-promise'

class Review extends Component {
  constructor (props) {
    super(props)

    this.state = {
      name: '',
      gender: '',
      age: ''
    }
  }

  componentWillMount () {
    const { steps } = this.props
    const { name, gender, age } = steps

    this.setState({ name, gender, age })
  }

  render () {
    const { name, gender, age } = this.state
    return (
      <div style={{ width: '100%' }}>
        <h3>Summary</h3>
        <table>
          <tbody>
            <tr>
              <td>Name</td>
              <td>{name.value}</td>
            </tr>
            <tr>
              <td>Gender</td>
              <td>{gender.value}</td>
            </tr>
            <tr>
              <td>Age</td>
              <td>{age.value}</td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }
}

Review.propTypes = {
  steps: PropTypes.object
}

Review.defaultProps = {
  steps: undefined
}

class SimpleForm extends Component {
  constructor () {
    super()
    this.state = {
      steps: null
    }
    console.log('constructor')
    console.log(this.state)
  }

  async componentWillMount () {
    const steps = await this.getSteps()
    await this.setState({
      steps: steps
    })
    console.log(this.state)
    this.forceUpdate()
  }

  async getSteps () {
    const response = await rp('https://zmeu213.unit.run/scenplaner?key=jA2zefFhS0q30Lc3YyhCaP46o0vACB3W')
    return JSON.parse(response)
  }

  render () {
    const { steps } = this.state
    console.log('render')
    return this.state.steps
    ? (
      <ChatBot
        steps={steps}
      />
    )
    : (
      <Loading />
    )
  }
}

export default SimpleForm
