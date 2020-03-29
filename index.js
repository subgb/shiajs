const crypto = require('crypto');

module.exports = {
	delay,
	promiseAny,
	digest,
	md5,
	sha256,
	sha512,
};


function delay(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

function _reversePromise(promise) {
	return new Promise((r, j) => Promise.resolve(promise).then(j, r));
}

// resolve while any promise fulfills, or reject while all promises rejected.
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

