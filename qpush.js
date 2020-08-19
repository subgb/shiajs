const fetch = require('node-fetch');
const {URLSearchParams} = require('url');
const {$log, timeiso} = require('.');

class QPush {
	constructor(name, code) {
		if (Array.isArray(name)) {
			[name, code] = name;
		}
		if (typeof name!=='string' || typeof code!=='string') {
			throw new Error('QPush needs name and code to init');
		}
		this.auth = {name, code};
	}

	async send(data) {
		try {
			const res = await fetch('https://qpush.me/pusher/push_site/', {
				timeout: 8e3,
				method: 'POST',
				body: new URLSearchParams({
					...this.auth,
					sig: '',
					//cache: false,
					...data,
				}),
			});
			if (!res.ok) {
				const body = await res.text();
				throw new Error(`http ${res.status}: ${body}`);
			}
			const body = await res.json();
			if (body && body.error) throw new Error(body.error);
			return body;
		}
		catch(e) {
			$log('[QPush Error]', e.message);
		}
	}

	async text(text) {
		return this.send({
			'msg[text]': text.slice(0,500),
		});
	}

	async url(title, url) {
		return this.send({
			'msg[text]': url,
			'msg[type]': 'url',
			'msg[extra][title]': title,
		});
	}

	async log(message) {
		return this.text(`[info] ${timeiso().slice(5)}\n${message}`);
	}

	async info(message) {
		return this.log(message);
	}

	async error(error) {
		const message = (error instanceof Error)? error.message: error;
		return this.text(`[ERROR] ${timeiso().slice(5)}\n${message}`);
	}
}

class QGroup {
	constructor(...users) {
		if (!Array.isArray(users[0])) {
			throw new Error('QGroup needs name code pairs to init')
		}
		if (Array.isArray(users[0][0])) [users]=users;
		this.instances = users.map(pair => new QPush(pair));
		'text,url,info,log,error'.split(',').map(fn => {
			this[fn] = (...args) => {
				this.instances.forEach(push => push[fn](...args));
				return this;
			};
		});
	}
}

module.exports = {
	QPush,
	QGroup,
};
