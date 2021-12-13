const {delay} = require('.');

module.exports = class PromiseChain {
	constructor(defaultCatch = ()=>{}) {
		this.defaultCatch = defaultCatch;
		this.chain = Promise.resolve();
	}

	addThen(func, ...args) {
		this.chain = this.chain.then(_=>func(...args));
		return this;
	}

	addCatch(func) {
		this.chain = this.chain.catch(func||this.defaultCatch);
		return this;
	}

	add(func, ...args) {
		this.chain = this.chain.then(_=>func(...args)).catch(this.defaultCatch);
		return this;
	}

	wait(ms) {
		return this.addThen(delay, ms);
	}
}
