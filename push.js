const {QPush} = require('./qpush')
const {IFTTT} = require('./ifttt');
const {Telegram} = require('./telegram');

const token = process.env.PUSH_TOKEN;
if (!token) throw new Error('env PUSH_TOKEN is not set.');

let push;
const [type, ...auth] = token.split(':');
switch(type) {
	case 'qpush': push=new QPush(...auth); break;
	case 'ifttt': push=new IFTTT(...auth); break;
	case 'tg': push=new Telegram(...auth); break;
	default: throw new Error('push type must be "qpush", "ifttt" or "tg".');
}

module.exports = push;
