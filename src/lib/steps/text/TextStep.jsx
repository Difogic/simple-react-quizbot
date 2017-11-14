import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Bubble from './Bubble'
import Image from './Image'
import ImageContainer from './ImageContainer'
import Loading from '../common/Loading'
import TextStepContainer from './TextStepContainer'
import Emoji from '../../Emoji'

class TextStep extends Component {
  /* istanbul ignore next */
  constructor (props) {
    super(props)

    this.state = {
      loading: true
    }

    this.renderMessage = this.renderMessage.bind(this)
  }

  componentDidMount () {
    const { step } = this.props
    const { component, delay, waitAction } = step
    const isComponentWatingUser = component && waitAction
    setTimeout(() => {
      this.setState({ loading: false }, () => {
        if (!isComponentWatingUser && !step.rendered) {
          this.props.triggerNextStep()
        }
      })
    }, delay)
  }

  renderMessage () {
    const {
      previousValue,
      step,
      steps,
      previousStep,
      triggerNextStep
    } = this.props
    const { component } = step
    let { message, image } = step

    if (component) {
      return React.cloneElement(component, {
        step,
        steps,
        previousStep,
        triggerNextStep
      })
    }

    if (image) {
      message = <img src={image} width='100%' />
    } else {
      message = (
        <Emoji size='16'>
          {message.replace(/{previousValue}/g, previousValue)}
        </Emoji>
      )
    }

    return message
  }

  render () {
    const {
      step,
      isFirst,
      isLast,
      avatarStyle,
      bubbleStyle,
      hideBotAvatar,
      hideUserAvatar
    } = this.props
    const {
      avatar,
      user
    } = step

    const showAvatar = user ? !hideUserAvatar : !hideBotAvatar

    return (
      <TextStepContainer
        className='rsc-ts'
        user={user}
      >
        <ImageContainer
          className='rsc-ts-image-container'
          user={user}
        >
          {
            isFirst && showAvatar &&
            <Image
              className='rsc-ts-image'
              style={avatarStyle}
              showAvatar={showAvatar}
              user={user}
              src={avatar}
              alt='avatar'
            />
          }
        </ImageContainer>
        <Bubble
          className='rsc-ts-bubble'
          style={bubbleStyle}
          user={user}
          showAvatar={showAvatar}
          isFirst={isFirst}
          isLast={isLast}
        >
          {
            this.state.loading &&
            <Loading />
          }
          { !this.state.loading && this.renderMessage() }
        </Bubble>
      </TextStepContainer>
    )
  }
}

TextStep.propTypes = {
  isFirst: PropTypes.bool.isRequired,
  isLast: PropTypes.bool.isRequired,
  step: PropTypes.object.isRequired,
  triggerNextStep: PropTypes.func.isRequired,
  avatarStyle: PropTypes.object.isRequired,
  bubbleStyle: PropTypes.object.isRequired,
  hideBotAvatar: PropTypes.bool.isRequired,
  hideUserAvatar: PropTypes.bool.isRequired,
  previousStep: PropTypes.object,
  previousValue: PropTypes.any,
  steps: PropTypes.object
}

TextStep.defaultProps = {
  previousStep: {},
  steps: {},
  previousValue: ''
}

export default TextStep
