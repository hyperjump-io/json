Json
====

This is a reimplementation of the builtin `JSON` object to add JSON Pointer
parameters to the "reviver" and "replacer" functions. Other than the added
parameters, the interface and behavior is the same as the original.

Installation
------------
Includes support for node.js (ES Modules, TypeScript) and browsers.

```bash
npm install @hyperjump/json
```

Usage
-----

```javascript
import * as Json from "@hyperjump/json";

const subject = `{
  "type": "object",
  "properties": {
    "foo": { "type": "string" },
    "bar": { "$ref": "#/$defs/number" }
  },
  "required": ["foo", "bar"],

  "$defs": {
    "number": { "type": "number" }
  }
}`;
const result = Json.parse(subject, (key, value, pointer) => {
  console.log("REVIVER", pointer, key, JSON.stringify(value));
  return value;
});

const json = Json.stringify(result, (key, value, pointer) => {
  console.log("REPLACER", pointer, key, value);
  return value;
}, "  ");
```

Contributing
------------

### Tests

Run the tests

```bash
npm test
```

Run the tests with a continuous test runner
```bash
npm test -- --watch
```
