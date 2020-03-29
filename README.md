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
