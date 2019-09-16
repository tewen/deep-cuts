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

#### acceptNoArguments(fn, [args])

Creates a function that accepts no arguments at call time. Behaves similar to lodash [partial](https://lodash.com/docs/4.17.11#partial) method, arguments can be provided at create time. None can be passed at call time.

```JavaScript
function myFunction(...args) {
  console.log(`I was called with ${args.length} arguments.`);
}

acceptNoArguments(myFunction)(0, 1, 2); // I was called with 0 arguments.

acceptNoArguments(myFunction, 3, 4)(0, 1, 2); // I was called with 2 arguments.
```


#### csvRowsToObjects(rows, [options={queryStringsToObjects: false, jsonStringsToObjects: false, parseFloats: false, trimValues: false, listDelimiter: ','}])

Takes an array of arrays as input and maps the headers out to objects in a consistent manner. Supports nesting with dot properties and array value types.

```JavaScript
const rows = [
 ['red', 'green[]', 'blue.forty.goodTimes'],
 ['1', 'Iron Maiden', 'Ronnie James'],
 ['2', 'Koolaid,Hawaiian Punch', 'Peter Griffin']
];

csvRowsToObjects(rows);

/** Output
[
    {
      red: '1',
      green: ['Iron Maiden'],
      blue: {
        forty: {
          goodTimes: 'Ronnie James'
        }
      }
    },
    {
      red: '2',
      green: ['Koolaid', 'Hawaiian Punch'],
      blue: {
        forty: {
          goodTimes: 'Peter Griffin'
        }
      }
    }
  ]
**/
```

##### Options
* **queryStringsToObjects**: Encodes query strings in array cells to objects.
* **jsonStringsToObjects**: Supports JSON objects in array cells.
* **parseFloats**: Parses any number found into a float. 
* **trimValues**: Trims extra whitespace in values.
* **listDelimiter**: Default is comma, can be any character used for array delimiting.


#### objectsToCsvRows(objects, [options={queryStringsToObjects: false, jsonStringsToObjects: false, listDelimiter: ','}])

This method is the inverse of the above method. This will take the nested objects and get them back to CSV rows format.

```JavaScript
const objects = [
{
  red: '1',
  green: ['Iron Maiden'],
  blue: {
    forty: {
      goodTimes: 'Ronnie James'
    }
  }
},
{
  red: '2',
  green: ['Koolaid', 'Hawaiian Punch'],
  blue: {
    forty: {
      goodTimes: 'Peter Griffin'
    }
  }
}
];

objectsToCsvRows(objects);

/** Output
[
 ['red', 'green[]', 'blue.forty.goodTimes'],
 ['1', 'Iron Maiden', 'Ronnie James'],
 ['2', 'Koolaid,Hawaiian Punch', 'Peter Griffin']
]
**/
```

##### Options
* **queryStringsToObjects**: Encodes query strings in array cells to objects.
* **jsonStringsToObjects**: Supports JSON objects in array cells.
* **listDelimiter**: Default is comma, can be any character used for array delimiting.


#### escapeForRegExp(str)

Escapes any special characters so the strings can safely be placed in a RegExp constructor.

```JavaScript
console.log(escapeForRegExp('function test() { return 5 * 5; }')); // function test\(\) \{ return 5 \* 5; \}
```


#### flattenObject(obj)

Flattens an object so that every property is available at the top-level via the same key path as a property string. Compatible with lodash [_.get](https://lodash.com/docs/4.17.11#get) / [_.set](https://lodash.com/docs/4.17.11#set).

```JavaScript
const obj = {
  name: {
    first: 'Lemmy',
    last: 'Kilmister'
  },
  favoriteColors: [
    { name: 'Black' },
    { name: 'Red' }
  ]
};

flattenObject(obj);

/** Output

{
  'name.first': 'Lemmy',
  'name.last': 'Kilmister',
  'favoriteColors[0].name': 'Black',
  'favoriteColors[1].name': 'Red'
}

**/
```


#### isJsonString(str)

Returns a boolean that specifies whether the string is parsable JSON.

```JavaScript
const str = JSON.stringify({red: 5, green: 6});

isJsonString(str); // true
``` 


#### stringToBoolean(str)

Usually used for url parameters, converts null, undefined, 0, false, or '' to false even if they are strings. All other values are true.

```JavaScript
console.log(stringToBoolean('0')); // false

console.log(stringToBoolean('null')); // false

console.log(stringToBoolean('undefined')); // false

console.log(stringToBoolean('false')); // false

console.log(stringToBoolean('')); // false

console.log(stringToBoolean(0)); // false

console.log(stringToBoolean(null)); // false

console.log(stringToBoolean(undefined)); // false

console.log(stringToBoolean(false)); // false

console.log(stringToBoolean()); // false

console.log(stringToBoolean(1)); // true

console.log(stringToBoolean({})); // true

console.log(stringToBoolean(true)); // true
```


#### safeJsonParse(strObj)

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
