const fs = require('fs');
const PATH = require('path');
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
	fileLinesMap,
	traverseDir,
	excelCsv,
	urlJoin,
	asyncPool,
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
	cr.update(data);
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

async function fileByLines(file, cbLine) {
	const rl = readline.createInterface({
		input: fs.createReadStream(file),
		crlfDelay: Infinity,
	});
	rl.on('line', cbLine);
	return new Promise(resolve => {
		rl.on('close', resolve);
	});
}

async function fileLinesMap(file, cbLine) {
	const list = [];
	return fileByLines(file, line => {
		list.push(cbLine(line));
	}).then(() => list);
}

function *traverseDir(parent) {
	const files = fs.readdirSync(parent);
	for (const name of files) {
		const path = PATH.join(parent, name);
		const stat = fs.lstatSync(path);
		const isdir = stat.isDirectory();
		yield {path, name, isdir, parent};
		if (isdir) yield *traverseDir(path);
	}
}

function excelCsv(file, list, headers) {
	if (!Array.isArray(list[0])) {
		const keys = Object.keys(list[0]);
		headers = headers || keys;
		list = list.map(row => headers.map(key=>row[key]));
	}
	if (headers) list = [headers, ...list];
	const csv = list.map(row => row.join('\t')).join('\r\n');
	fs.writeFileSync(file, '\uFEFF'+csv, 'utf16le');
}

function urlJoin(host, path='/') {
	host = /:\/\//.test(host)? host: 'http://'+host;
	if (host.endsWith('/')) host = host.slice(0,-1);
	if (!path.startsWith('/')) path = '/'+path;
	if (path=='/') path='';
	return host+path;
}

async function asyncPool(list, worker, size=10, showError=false) {
	size = Math.max(1, Math.min(999, list.length, size));
	const prefix = '$'+(Math.random()).toString(36).slice(2,5).toUpperCase()+'-';
	let index = 0;
	const thread = async id => {
		const label = prefix + String(id+1001).slice(-3);
		while (true) {
			const current = index++;
			if (list.length <= current) return;
			try {
				const abort = await worker(list[current], current, list, label);
				if (abort instanceof Error) {
					$log(`ABORT ${current} [${label}] ${abort.message}`);
					return abort
				}
			}
			catch (err) {
				if (showError===true){
					$log(`ERROR ${current} [${label}] ${err.message}`);
				}
				else if (typeof showError==='function') {
					await showError(err, list[current], current, list, label);
				}
			}
		}
	};
	return Promise.all([...Array(size)].map(
		(x,i) => thread(i).catch(e=>$log(e))
	));
}
