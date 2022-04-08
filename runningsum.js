module.exports = class RunningSum {
	constructor(size) {
		this.idx = 0;
		this.sum = 0;
		this.circle = Array(size).fill(0);
	}

	add(num, undo=false) {
		undo = undo===true;
		const size = this.size;
		if (undo) this.idx = (this.idx-1 + size) % size;
		const drop = this.circle[this.idx];
		this.sum += num - drop;
		this.circle[this.idx] = num;
		if (!undo) this.idx = (this.idx+1) % size;
		return this;
	}

	fill(num) {
		this.circle.fill(num);
		this.sum = this.size * num;
		return this;
	}

	get size() {
		return this.circle.length;
	}

	get avg() {
		return this.sum / this.size;
	}
}
