module.exports = class Deferred {
	constructor(timeout) {
		this.promise = new Promise((resolve, reject) => {
			this.resolve = resolve;
			this.reject = reject;
			if (timeout) setTimeout(()=>reject(new Error('deferred timeout')), timeout);
		});
	}
}
