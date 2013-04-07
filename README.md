# Tower Stream

## Installation

node.js:

```bash
npm install tower-stream
```

browser:

```bash
component install tower/stream
```

## Example

```js
var stream = require('tower-stream');

stream('word-counter')
  .on('init', function(s){

  })
  .on('execute', function(s, fn){

  })
  .on('close', function(s, fn){

  });
```

## Licence

MIT