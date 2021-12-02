### async delay(ms)

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

### $log(...)
console.log starts with time.

### async fileByLines(file, cbLine)
Call cbLine() every lines of the file, return promise.

### async fileLinesMap(file, cbLine)
Create an array by running every lines of the file thru cbLine().

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

### async asyncPool(list, worker, size=10, showError=false)
Async call `worker(list[idx], idx, list, label)` every item of `list` parallelly.
`size` is the thread pool size;
`showError` can be true, false, or an async function `showError(err, list[idx], idx, list, label)`.


-----
# Push Notification
This return an instance of the QPush, IFTTT or Telegram class based on the env variable PUSH_TOKEN.

```js
const push = require('shiajs/push');
push.log('push some log');
```

Put PUSH_TOKEN on the /etc/environment for global use:
```
PUSH_TOKEN="qpush:name:code"
# PUSH_TOKEN="ifttt:token_key:event"
# PUSH_TOKEN="tg:bot_id:bot_token:chat_id"
```

### QPush & QGroup class
Send push notification to QPush app for iOS.

```js
const {QPush, QGroup} = require('shiajs/qpush');

const push = new QPush('name', 'code');
push.log('push some log'); // push.info() is the same
push.error(new Error('push an error'));

const group = new QGroup(['name1', 'code1'], ['name2', 'code2']);
group.info('info to group').error('push error to group');
```

### IFTTT class
Send push notification to IFTTT app.

```js
const {IFTTT} = require('shiajs/ifttt');
const push = new IFTTT('token');
const push2 = new IFTTT('token2', 'default_event_name');
push.log('push some log'); // push.info() is the same
push.error(new Error('push an error'));
push.send({
    value1: 'text1',
    value2: 'text2',
}, 'event_name');
```

### Telegram class
Send push notification to Telegram app.
```js
const {Telegram} = require('shiajs/telegram');
const tg = new Telegram('123456789', 'token', 'chat_id_1');
tg.setChatIds('chat_id_1', 'chat_id_2', 'chat_id_3'); // push to multi
tg.agent = new ProxyAgent('socks5h://127.0.0.1:1080'); // use socks proxy
tg.log('push some log'); // tg.info() is the same
tg.error(new Error('push an error'));
tg.showMessages(); // received messages in bot
```


-----
# Stopwatch class

```js
const Stopwatch = require('shiajs/stopwatch');
const sw = new Stopwatch();
// ...
sw.tap('label');
// ...
const elapse1 = sw.tap();
console.log(elapse1, sw.get('label'), sw.toString(3));
```


-----
# Persist Ojbect
Auto save object to a file while changed.

```js
const Persist = require('shiajs/persist');
const config = Persist('/data/mypath/myconfig.json', /*default value*/);
config.foo = 'bar'; // will auto save to the file
console.log(config.foo);
```
