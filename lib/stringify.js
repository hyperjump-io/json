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
    return "[]";
  }

  const padding = space ? `\n${space.repeat(depth - 1)}` : "";

  let result = "[" + padding + space;
  for (let index = 0; index < value.length; index++) {
    const indexPointer = JsonPointer.append(index, pointer);
    const stringifiedValue = stringifyValue(value[index], replacer, space, index + "", indexPointer, depth + 1);
    result += stringifiedValue === undefined ? "null" : stringifiedValue;
    if (index + 1 < value.length) {
      result += `,${padding}${space}`;
    }
  }
  return result + padding + "]";
};

const stringifyObject = (value, replacer, space, pointer, depth) => {
  const entries = Object.entries(value);
  if (entries.length === 0) {
    return "{}";
  }

  const padding = space ? `\n${space.repeat(depth - 1)}` : "";
  const colonSpacing = space ? " " : "";

  let result = "{" + padding + space;
  for (let index = 0; index < entries.length; index++) {
    const [key, value] = entries[index];
    const keyPointer = JsonPointer.append(key, pointer);
    const stringifiedValue = stringifyValue(value, replacer, space, key, keyPointer, depth + 1);
    if (stringifiedValue !== undefined) {
      result += JSON.stringify(key) + ":" + colonSpacing + stringifiedValue;
      if (entries[index + 1]) {
        result += `,${padding}${space}`;
      }
    }
  }
  return result + padding + "}";
};

module.exports = stringify;
