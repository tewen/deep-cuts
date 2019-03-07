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

#### acceptNoArguments()

Creates a function that accepts no arguments at call time. Behaves similar to lodash [partial](https://lodash.com/docs/4.17.11#partial) method, arguments can be provided at create time. None can be passed at call time.

```JavaScript
function myFunction(...args) {
  console.log(`I was called with ${args.length} arguments.`);
}

acceptNoArguments(myFunction)(0, 1, 2); // I was called with 0 arguments.

acceptNoArguments(myFunction, 3, 4)(0, 1, 2); // I was called with 2 arguments.
```


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
