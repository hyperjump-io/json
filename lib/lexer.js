import moo from "moo";


const digit = `[0-9]`;
const digit19 = `[1-9]`;
const hexdig = `[0-9a-fA-F]`;

// String
const unescaped = `[\\x20-\\x21\\x23-\\x5b\\x5d-\\u{10ffff}]`;
const escape = `\\\\`;
const escaped = `${escape}(?:["\\/\\\\brfnt]|u${hexdig}{4})`;
const char = `(?:${unescaped}|${escaped})`;
const string = `"${char}*"`;

// Number
const int = `(?:0|${digit19}${digit}*)`;
const frac = `\\.${digit}+`;
const e = `[eE]`;
const exp = `${e}[-+]?${digit}+`;
const number = `-?${int}(?:${frac})?(?:${exp})?`;

// Whitespace
const whitespace = `(?:(?:\\r?\\n)|[ \\t])+`;

export default (json) => {
  const lexer = moo.states({
    main: {
      WS: { match: new RegExp(whitespace, "u"), lineBreaks: true },
      true: { match: "true", value: () => true },
      false: { match: "false", value: () => false },
      null: { match: "null", value: () => null },
      number: { match: new RegExp(number, "u"), value: parseFloat },
      string: { match: new RegExp(string, "u"), value: JSON.parse },
      "{": "{",
      "}": "}",
      "[": "[",
      "]": "]",
      ":": ":",
      ",": ",",
      error: moo.error
    }
  });
  lexer.reset(json);

  const _next = () => {
    let token;
    do {
      token = lexer.next();
      if (token?.type === "error") {
        throw SyntaxError(lexer.formatError(token, "Unrecognized token"));
      }
    } while (token?.type === "WS");

    return token;
  };

  let previous;
  let nextToken = _next();

  const next = (expectedType = undefined) => {
    previous = nextToken;
    nextToken = _next();
    if (expectedType && previous?.type !== expectedType) {
      throw SyntaxError(lexer.formatError(previous, `Expected a '${expectedType}'`));
    }
    return previous;
  };

  const peek = () => nextToken;

  const defaultErrorToken = { offset: 0, line: 1, col: 0, text: "" };
  const syntaxError = (message) => {
    const referenceToken = previous || defaultErrorToken;
    const errorToken = {
      ...referenceToken,
      offset: referenceToken.offset + referenceToken.text.length,
      col: referenceToken.col + referenceToken.text.length
    };
    throw new SyntaxError(lexer.formatError(errorToken, message));
  };

  return { next, peek, syntaxError };
};
