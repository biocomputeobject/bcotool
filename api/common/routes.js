'use strict'

module.exports = [
  {
    prefix: '/image',
    pin: 'role:image,cmd:*',
    map: {
      add: true,
      delete: true,
      find: true,
      edit: {
        GET: true
      }
    }
  },
  {
    prefix: '/admin',
    pin: 'role:admin,cmd:*',
    map: {
      add : true,
      validate: {
        GET: true,
        alias: '/manage'
      }
    }
  }
]
