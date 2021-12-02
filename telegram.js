const fetch = require('node-fetch');
const {$log, timeiso} = require('.');

class Telegram {
	constructor(bot_id, bot_token, chat_id) {
		if (typeof bot_id!=='string' || typeof bot_token!=='string') {
			throw new Error('Telegram needs bot_id and bot_token to init');
		}
		this.auth = `${bot_id}:${bot_token}`;
		this.setChatIds(chat_id);
	}

	setChatIds(...ids) {
		if (Array.isArray(ids[0])) ids=ids[0];
		this.chatIds = ids.filter(x=>/^\d+$/.test(x));
	}

	async send(body) {
		try {
			const res = await fetch(`https://api.telegram.org/bot${this.auth}/sendMessage`, {
				agent: this.agent,
				timeout: 8e3,
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify(body),
			});
			const text = await res.text();
			if (!res.ok) throw new Error(`http ${res.status}: ${text}`);
			return text;
		}
		catch (e) {
			$log('[Telegram Error]', e.message);
		}
	}

	async pushToChat(chat_id, message, tag='info') {
		return this.send({
			chat_id,
			text: `[${tag}] ${timeiso().slice(5)}\n${message}`,
		});
	}

	log(message) {
		if (!this.chatIds.length) throw new Error('needs chat_id');
		for (const chat_id of this.chatIds) {
			this.pushToChat(chat_id, message, 'info');
		}
		return this;
	}

	info(message) {
		this.log(message);
		return this;
	}

	error(error) {
		if (!this.chatIds.length) throw new Error('needs chat_id');
		const message = (error instanceof Error)? error.message: error;
		for (const chat_id of this.chatIds) {
			this.pushToChat(chat_id, message, 'ERROR');
		}
		return this;
	}

	async showMessages() {
		const res = await fetch(`https://api.telegram.org/bot${this.auth}/getUpdates`, {
			agent: this.agent,
			timeout: 8e3,
		});
		const json = await res.json();
		console.log(json.ok, json.result.length);
		for (const {message} of json.result) {
			const from = message.from
			console.log(`${timeiso(message.date*1e3)} #${message.message_id} from ${from.id} <@${from.username} ${from.first_name} ${from.last_name}> ${message.text}`)
		}
		return json;
	}
}

module.exports = {
	Telegram,
};
