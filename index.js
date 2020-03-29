const crypto = require('crypto');
const readline = require('readline');

module.exports = {
	delay,
	promiseAny,
	digest,
	md5,
	sha256,
	sha512,
	timeiso,
	$log,
	fileByLines,
};


function delay(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

function _reversePromise(promise) {
	return new Promise((r, j) => Promise.resolve(promise).then(j, r));
}

function promiseAny(iterable) {
	return _reversePromise(Promise.all([...iterable].map(_reversePromise)));
}

function digest(algorithm, data, hmackey) {
	const cr = hmackey? crypto.createHmac(algorithm, hmackey):
		crypto.createHash(algorithm);
	cr.update(data, 'utf8');
	return cr.digest('hex');
}

function md5(data) {
	return digest('md5', data);
}

function sha256(data, hmackey) {
	return digest('sha256', data, hmackey);
}

function sha512(data, hmackey) {
	return digest('sha512', data, hmackey);
}

function timeiso(date, tz=null, len=-5) {
	const ts = (!date || isNaN(+date))? Date.now(): +date;
	tz = (tz===0 || tz && !isNaN(+tz))? +tz: -new Date().getTimezoneOffset()/60;
	let str = new Date(ts + tz*3600e3).toJSON();
	if(!str) return '';
	if (len != 'h') str = str.replace('T',' ');
	len = +len || +{y:4,m:7,d:10,h:13,M:16,s:-5,S:-1,sss:-1}[len] || -5;
	return str.slice(0, Math.min(len, str.length-1));
}

function $log(...args) {
	const now = `[${timeiso().slice(5)}]`;
	if (typeof args[0]==='string') {
		args[0] = now + ' ' + args[0];
	}
	else {
		args.unshift(now);
	}
	console.log(...args);
}

function fileByLines(file, cbLine) {
	const rl = readline.createInterface({
		input: fs.createReadStream(file),
		crlfDelay: Infinity,
	});
	rl.on('line', cbLine);
	return new Promise(resolve => {
		rl.on('close', resolve);
	});
}
