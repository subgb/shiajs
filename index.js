module.exports = {
	delay,
	promiseAny,
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
