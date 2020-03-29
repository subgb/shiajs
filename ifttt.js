const rp = require('request-promise');
const {$log, timeiso} = require('.');

class IFTTT {
	constructor(token, event) {
		if (typeof token!=='string') {
			throw new Error('IFTTT needs token to init');
		}
		this.token = token;
		this.event = event;
	}

	async send(body, event) {
		event = event || this.event || 'default';
		try {
			return await rp({
				json: true,
				method: 'POST',
				url: `https://maker.ifttt.com/trigger/${event}/with/key/${this.token}`,
				body,
			});
		}
		catch(e) {
			$log('[IFTTT Error]', e.message);
		}
	}

	async log(message) {
		return this.send({
			value1: `${timeiso().slice(5)}\n${message}`,
			value2: 'info',
		});
	}

	async info(message) {
		return this.log(message);
	}

	async error(error) {
		const message = (error instanceof Error)? error.message: error;
		return this.send({
			value1: `${timeiso().slice(5)}\n${message}`,
			value2: 'ERROR',
		});
	}
}

module.exports = {
	IFTTT,
};
