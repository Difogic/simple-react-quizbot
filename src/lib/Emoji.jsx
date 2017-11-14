import PropTypes from 'prop-types'
import React, { Component } from 'react'
import twemoji from 'twemoji'
import CSSPropertyOperations from 'react-css-property-operations'

/**
 * @type {string[]}
 */
const IMG_EXTENSIONS = ['.png', '.gif', '.jpg', '.jpeg', '.bmp', '.webp', '.svg', '.svgz']

/**
 * Element which parses utf8 emoji found in the element children
 *
 * @type {*|{}}
 */
// var Emoji = React.createClass({
class Emoji extends Component {
  /**
   * Parses the given string or DOM element
   *
   * @param {string|HTMLElement} element The source to parse and enrich with emoji
   * @param {object}             [opts]  Parse options
   * @returns {string|HTMLElement}
   */
  parse (element, opts) {
    let preImages = []
    let preLength = 0

    if (opts.complete && opts.complete.length > 0) {
      let images = element.getElementsByTagName('img')
      preLength = images.length
      for (let i = 0; i < preLength; i++) {
        preImages.push(images[i])
      }
    }

    let parsed = twemoji.parse(element, {
      size: parseInt(opts.size),
      base: opts.base.replace(/\/$/, ''),
      ext: opts.ext,
      className: opts.imgClassName,
      callback: opts.callback,
      attributes: opts.attributes,
      onerror: opts.onerror
    })

    if (opts.complete) {
      if (opts.complete.length === 0) {
        opts.complete()
      } else {
        let newImages = []
        let postImages = element.getElementsByTagName('img')
        let postLength = postImages.length
        if (postLength > preLength) {
          for (let i = 0; i < postLength; i++) {
            if (preLength === 0) {
              newImages.push(postImages[i])
            } else {
              for (let y = 0; y < preLength; y++) {
                if (postImages[i].outerHTML !== preImages[y].outerHTML) {
                  newImages.push(postImages[i])
                }
              }
            }
          }
        }

        opts.complete(newImages)
      }
    }

    return parsed
  }

  /**
   * For given an HEX codepoint, returns UTF16 surrogate pairs
   *
   * @param {string} codepoint Generic codepoint, i.e. '1F4A9'
   * @returns {string}
   */
  fromCodePoint (codepoint) {
    return twemoji.convert.fromCodePoint(codepoint)
  }

  /**
   * For given UTF16 surrogate pairs, returns the equivalent HEX codepoint
   *
   * @param {string} surrogates Generic utf16 surrogates pair, i.e. \uD83D\uDCA9
   * @param {string} [sep]      Optional separator for double code points, default='-'
   * @returns {string}
   */
  toCodePoint (surrogates, sep) {
    return twemoji.convert.toCodePoint(surrogates, sep)
  }

  componentDidMount () {
    this.key = 0
    this._parse()
  }

  componentWillUpdate () {
    // Further calls to twemoji.parse() will fail unless we change the
    // component key with each update.
    this.key++
  }

  componentDidUpdate () {
    this._parse()
  }

  /**
   * @returns {XML}
   */
  render () {
    var props = ObjectOmit(this.props, ObjectKeys(Emoji.propTypes))
    props.ref = 'root'
    props.key = this.key

    return React.createElement(this.props.tag, props, this.props.children)
  }

  /**
   * @private
   */
  _parse () {
    this.parse(this.refs.root, {
      size: parseInt(this.props.size),
      base: this.props.base.replace(/\/$/, ''),
      ext: this.props.ext,
      imgClassName: this.props.imgClassName,
      callback: this._callback.bind(this),
      attributes: this._attributes.bind(this),
      complete: this.props.onComplete,
      onerror: this.props.onError
    })
  }

  /**
   * @param {string} icon
   * @param {Object} options
   * @returns {*}
   * @private
   */
  _callback (icon, options) {
    var opts = {
      icon: icon,
      base: options.base,
      size: options.size,
      ext: options.ext
    }
    if (this.props.onParse) {
      if (this.props.onParse(opts) === false) {
        return false
      }
    }

    return `${opts.base}/${opts.size}/${opts.icon}${opts.ext}`
  }

  /**
   * @returns {{}}
   * @private
   */
  _attributes () {
    var attribs = {}
    if (this.props.imgTitle) {
      attribs.title = this.props.imgTitle
    }
    if (this.props.imgStyle) {
      // throw new Error('Not supported, sorry :(')
      attribs.style = CSSPropertyOperations.createMarkupForStyles(this.props.imgStyle, null)
    }

    return attribs
  }
}

Emoji.propTypes = {
  size: PropTypes.oneOf([16, 36, 72, '16', '36', '72']),
  base: PropTypes.string.isRequired,
  tag: PropTypes.string,
  imgClassName: PropTypes.string,
  imgStyle: PropTypes.object,
  imgTitle: PropTypes.string,
  ext: PropTypes.oneOf(IMG_EXTENSIONS).isRequired,
  onParse: PropTypes.func,
  onComplete: PropTypes.func,
  onError: PropTypes.func
}

/**
 *
 * @type {{size: number, base: string, ext: string, tag: string, imgClassName: string, imgStyle: {}, imgTitle: string, onParse: null, onComplete: null, onError: Function}}
 */
Emoji.defaultProps = {
  size: 72,
  base: 'https://twemoji.maxcdn.com',
  ext: '.png',
  tag: 'span',
  imgClassName: 'emoji',
  imgStyle: {},
  imgTitle: '',
  onParse: null,
  onComplete: null,
  onError: function () {}
}

const HAS_ENUM_BUG = !({
  toString: null
}).propertyIsEnumerable('toString')
const DONT_ENUM = [
  'toString',
  'toLocaleString',
  'valueOf',
  'hasOwnProperty',
  'isPrototypeOf',
  'propertyIsEnumerable',
  'constructor'
]
const DONT_ENUM_LENGTH = DONT_ENUM.length

/**
 * @param {Object} obj
 * @returns {Array}
 */
function ObjectKeys (obj) {
  if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null)) {
    throw new TypeError('ObjectKeys called on non-object')
  }

  let result = []
  let prop
  let i
  for (prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      result.push(prop)
    }
  }
  if (HAS_ENUM_BUG) {
    for (i = 0; i < DONT_ENUM_LENGTH; i++) {
      if (obj.hasOwnProperty(DONT_ENUM[i])) {
        result.push(DONT_ENUM[i])
      }
    }
  }

  return result
}

/**
 * @param {Object} obj
 * @param {Array} props
 * @returns {{}}
 */
function ObjectOmit (obj, props) {
  let newObj = {}
  let key
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (props.indexOf(key) === -1) {
        newObj[key] = obj[key]
      }
    }
  }

  return newObj
}

export default Emoji
