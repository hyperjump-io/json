const JsonPointer = require("@hyperjump/json-pointer");


const defaultReplacer = (key, value) => value;
const stringify = (value, replacer = defaultReplacer, space = "") => {
  return stringifyValue(value, replacer, space, "", JsonPointer.nil, 1);
};

const stringifyValue = (value, replacer, space, key, pointer, depth) => {
  value = replacer(key, value, pointer);
  let result;
  if (Array.isArray(value)) {
    result = stringifyArray(value, replacer, space, pointer, depth);
  } else if (typeof value === "object" && value !== null) {
    result = stringifyObject(value, replacer, space, pointer, depth);
  } else {
    result = JSON.stringify(value);
  }

  return result;
};

const stringifyArray = (value, replacer, space, pointer, depth) => {
  if (value.length === 0) {
    space = "";
  }
  const padding = space ? `\n${space.repeat(depth - 1)}` : "";
  return "[" + padding + space + value
    .map((item, index) => {
      const indexPointer = JsonPointer.append(index, pointer);
      return stringifyValue(item, replacer, space, index, indexPointer, depth + 1);
    })
    .join(`,${padding}${space}`) + padding + "]";
};

const stringifyObject = (value, replacer, space, pointer, depth) => {
  if (Object.keys(value).length === 0) {
    space = "";
  }
  const padding = space ? `\n${space.repeat(depth - 1)}` : "";
  const spacing = space ? " " : "";
  return "{" + padding + space + Object.entries(value)
    .map(([key, value]) => {
      const keyPointer = JsonPointer.append(key, pointer);
      return JSON.stringify(key) + ":" + spacing + stringifyValue(value, replacer, space, key, keyPointer, depth + 1);
    })
    .join(`,${padding}${space}`) + padding + "}";
};

module.exports = stringify;
