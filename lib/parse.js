import * as JsonPointer from "@hyperjump/json-pointer";
import jsonLexer from "./lexer.js";


const defaultReviver = (key, value) => value;
export const parse = (json, reviver = defaultReviver) => {
  const lexer = jsonLexer(json);
  const value = parseValue(lexer, "", JsonPointer.nil, reviver);

  const token = lexer.peek();
  if (token) {
    lexer.syntaxError("A value has been parsed, but more tokens were found");
  }
  return value;
};

const parseValue = (lexer, key, pointer, reviver) => {
  let value;
  const token = lexer.next();
  switch (token?.type) {
    case "true":
    case "false":
    case "null":
    case "number":
    case "string":
      value = token.value;
      break;
    case "{":
      value = parseObject(lexer, key, pointer, reviver);
      break;
    case "[":
      value = parseArray(lexer, key, pointer, reviver);
      break;
    default:
      lexer.syntaxError("Expected a JSON value");
  }

  return reviver(key, value, pointer);
};

const parseObject = (lexer, key, pointer, reviver) => {
  const value = {};

  if (lexer.peek()?.type !== "}") {
    parseProperties(lexer, key, pointer, reviver, value);
  }

  lexer.next("}");

  return value;
};

const parseProperties = (lexer, key, pointer, reviver, value) => {
  const propertyName = lexer.next("string").value;
  lexer.next(":");
  if (!isValueToken(lexer.peek())) {
    lexer.syntaxError("Expected a JSON value");
  }
  value[propertyName] = parseValue(lexer, propertyName, JsonPointer.append(propertyName, pointer), reviver);

  if (lexer.peek()?.type === ",") {
    lexer.next(); // burn comma
    parseProperties(lexer, propertyName, pointer, reviver, value);
  } else if (isValueToken(lexer.peek())) {
    lexer.next(",");
  }
};

const parseArray = (lexer, key, pointer, reviver) => {
  const value = [];

  if (lexer.peek()?.type !== "]") {
    parseItems(lexer, 0, pointer, reviver, value);
  }

  lexer.next("]");

  return value;
};

const parseItems = (lexer, key, pointer, reviver, value) => {
  if (!isValueToken(lexer.peek())) {
    lexer.syntaxError("Expected a JSON value");
  }
  value[key] = parseValue(lexer, key, JsonPointer.append(key, pointer), reviver);
  if (lexer.peek()?.type === ",") {
    lexer.next(); // burn comma
    parseItems(lexer, key + 1, pointer, reviver, value);
  } else if (isValueToken(lexer.peek())) {
    lexer.next(",");
  }
};

const valueType = new Set(["string", "number", "true", "false", "null", "[", "{"]);
const isValueToken = (token) => valueType.has(token?.type);
