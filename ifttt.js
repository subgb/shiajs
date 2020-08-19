const fetch = require('node-fetch');
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
			const res = await fetch(`https://maker.ifttt.com/trigger/${event}/with/key/${this.token}`, {
				timeout: 8e3,
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify(body),
			});
			const text = await res.text();
			if (!res.ok) {
				throw new Error(`http ${res.status}: ${text}`);
			}
			return text;
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
