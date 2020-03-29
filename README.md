### delay(ms)

### promiseAny(iterable)
Any promise fulfills -> resolve(value);
All promises rejected -> reject(errArray).

### digest(algorithm, data, hmackey)

### md5(str)

### sha256(str, hmackey)

### sha512(str, hmackey)

### timeiso(date, tz=null, len=-5)
ISO 8601 format datetime.
`date` can be a Date object or timestamp (milliseconds), otherwise as now;
`tz` is the timezone, or use local timesozne if it is not a number;
`len` can be a number or date directive.

### $log
console.log starts with time.

### fileByLines(file, cbLine)
Call cbLine() every lines of the file, return promise.

### \*traverseDir(parent)
Traverse a folder recursively.
```js
for (const f of traverseDir('FOLDER')) console.log(f);
```

### excelCsv(file, list, headers)
`file` is the csv path to write;
`list` is a list of list, or a list of object;
`headers` is table headers, can ignore.

### urlJoin(host, path='/') 

### asyncPool(list, worker, size=10, showError=false)
Async call `worker(list[idx], idx, list, label)` every item of `list` parallelly.
`size` is the thread pool size;
`showError` can be true, false, or an async function.


-----

## QPush & QGroup class

Send push notification to QPush app for iOS.

```js
const {QPush, QGroup} = require('shiajs/qpush');

const push = new QPush('name', 'code');
push.log('push some log'); // push.info() is the same
push.error(new Error('push an error'));

const group = new QGroup(['name1', 'code1'], ['name2', 'code2']);
group.info('info to group').error('push error to group');
```
