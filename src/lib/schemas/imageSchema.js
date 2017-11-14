export default [
  {
    key: 'id',
    types: ['string', 'number'],
    required: true
  },
  {
    key: 'image',
    types: 'string',
    required: true
  },
  {
    key: 'avatar',
    types: ['string'],
    required: false
  },
  {
    key: 'trigger',
    types: ['string', 'number', 'function'],
    required: false
  },
  {
    key: 'delay',
    types: ['number'],
    required: false
  },
  {
    key: 'end',
    types: ['boolean'],
    required: false
  }
]
