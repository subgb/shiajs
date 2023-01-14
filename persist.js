const os = require('os');
const fs = require('fs');
const path = require('path');

module.exports = Persist;

function Persist(file, init) {
	const store = fs.existsSync(file)
		? JSON.parse(fs.readFileSync(file, 'utf8'))
		: {...init};

	const save = () => {
		timer = null;
		const text = JSON.stringify(store, null, 2);
		fs.writeFileSync(file, text);
	};
	let timer = setTimeout(save, 100);

	return new Proxy(store, {
		set(target, key, val) {
			target[key] = val;
			if (!timer) timer=setTimeout(save, 100);
			return true; 
		},
	});
}

Persist.tmp = function(filename) {
	const file = path.join(os.tmpdir(), filename);
	return Persist(file);
}
