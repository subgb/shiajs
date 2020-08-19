const sjs = require('.');

const push = require('./push')
push.error(new Error('a中b1[2-3 4/5&6=7'))

