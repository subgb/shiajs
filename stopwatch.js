module.exports = class Stopwatch {
	constructor() {
		this.start = Date.now();
		this.last = this.start;
		this.list = [];
		this.maps = new Map();
	}

	tap(label='#') {
		const ts = Date.now();
		const elapse = (ts-this.last)/1000;
		this.last = ts;
		const item = {label, ts, elapse};
		this.list.push(item);
		this.maps.set(label, item);
		return elapse;
	}

	get(label) {
		if (this.maps.has(label)) return this.maps.get(label).elapse;
		return this.list[label].elapse;
	}

	toString() {
		const list = this.list.map(x => `${x.label}:${x.elapse.toFixed(3)}s`);
		let str = list.join(' ');
		if (list.length>1) {
			const all = (this.last-this.start)/1000;
			str += ` all:${all.toFixed(3)}s`;
		}
		return '{'+str+'}';
	}
}
