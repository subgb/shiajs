module.exports = class Deferred {
	constructor() {
		this.promise = new Promise((resolve, reject) => {
			this.resolve = resolve;
			this.reject = reject;
		});
	}

	timeout(ms) {
		if (ms) setTimeout(() => this.reject(new Error('deferred timeout')), ms);
		return this.promise;
	}
}
