import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ChatBot, { Loading } from 'react-simple-chatbot'
import rp from 'request-promise'
import { parse } from 'twemoji'

class AudioStep extends Component {
  render () {
    const { audio } = this.props

    return (
      <div>
        <audio src={audio} controls />
      </div>
    )
  }
}

AudioStep.propTypes = {
  audio: PropTypes.string
}

class ImageStep extends Component {
  render () {
    const { image } = this.props

    return (
      <div>
        <img src={image} width='100%' />
      </div>
    )
  }
}

ImageStep.propTypes = {
  image: PropTypes.string
}

class ResultsView extends Component {
  constructor (props) {
    super(props)
    const { steps } = this.props
    const score = Object.values(steps).filter(i => i.value > 0).length
    this.state = {
      score: score
    }
  }

  async componentWillMount () {

  }

  createBageUrl (name, score, locale) {
    return `https://zmeu213.unit.run/quiz-bot-bage-creator?name=${encodeURIComponent(name)}&score=${score}&lang=${locale}`
  }

  render () {
    const { score } = this.state
    const imgurl = this.createBageUrl('Noname', score, 'en_US')
    return (
      <div>
        <h3>You scored {score} of 10!</h3>
        <img src={imgurl} alt='Badge' width='100%' />
      </div>
    )
  }
}

ResultsView.propTypes = {
  steps: PropTypes.object
}

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
      console.error(error)
      await this.setState({
        steps: [{
          id: 'no-internet',
          message: 'No  internet connection'
        }]
      })
    }
  }

  async getSteps () {
    const response = await rp('https://zmeu213.unit.run/scenplaner?key=jA2zefFhS0q30Lc3YyhCaP46o0vACB3W')
    const steps = JSON.parse(response)
    this.addComponents(steps)
    return steps
  }

  getQuestionsIDs () {
    const { steps } = this.state
    const qustionIDs = steps.filter(step => step.options).map(step => step.id)
    return qustionIDs
  }

  handleEnd ({ steps, values }) {
  }

  addComponents (steps) {
    steps.forEach(step => {
      if (step.end) {
        delete step.message
        step.component = <ResultsView />
      }
      if (step.audio) {
        const audio = step.audio
        delete step.audio
        step.component = <AudioStep audio={audio} />
      }
      if (step.image) {
        const image = step.image
        delete step.image
        step.component = <ImageStep image={image} />
      }
      // if (step.message) {
      //   step.message = parse(step.message)
      // }
    })
    console.log(steps)
  }

  render () {
    const { steps } = this.state
    const handleEnd = this.handleEnd.bind(this)
    return <div> {
      this.state.steps
      ? (
        <ChatBot
          handleEnd={handleEnd}
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
