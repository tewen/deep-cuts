## Deep Cuts

This project is a collection of otherwise uncategorized utility functions. Requires [Lodash](https://www.npmjs.com/package/lodash) as peer dependency, be warned.

### Installation

```BASH
npm install --save lodash
npm install --save deep-cuts
```

### Getting Started

Just require the module, every method lives at the top level.

```JavaScript
const { safeJsonParse } = require('deep-cuts');

console.log(safeJsonParse(JSON.stringify({message: 'I will be safely parsed'})));
```

### Methods

#### safeJsonParse()

Wrapper around JSON.parse that will not throw errors for nil or poorly formatted strings. Returns null in any invalid case.

```JavaScript
console.log(safeJsonParse("{\"message\": \"I will be safely parsed\"}")); // I will be safely parsed

console.log(safeJsonParse("{\"bad_key: \"value\"}")); // null

console.log(safeJsonParse(undefined)); // null
```

### Contribution Guidelines

Fork the respository and install all the dependencies:

```BASH
npm install
```

Make sure to run the unit tests (and lint) before committing. Obviously, add to the tests as you make changes:

```BASH
npm run test
```

For watch:

```BASH
npm run test:watch
```
