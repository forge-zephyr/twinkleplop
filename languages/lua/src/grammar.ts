// Lua 5.4 lexical syntax: long brackets of every level, short strings with every
// escape, hex and decimal numerals, attribs, labels, and function names.
//
// Known limitations (deliberate):
//   - Calls and function names are found by looking ahead over whitespace only.
//     A comment between a name and its arguments (`f --[[x]] (1)`) leaves the
//     name an identifier, and a comment inside a dotted function name
//     (`function a --[[x]] .b()`) makes the name before it a function too.
//   - A call is a name directly followed by `(`, a string or `{`. A name that
//     is only used as a value (`local g = print`) is an identifier, and so is
//     the result of an expression call (`f()()`, `t[1]()`), which has no name.
//   - Only `#!` at the very start of the input is a shebang comment. Lua's
//     loader skips any first line starting with `#`, which is not part of the
//     language syntax.
//   - Invalid escapes (`\q`) are highlighted like valid ones, and a malformed
//     numeral (`3x`, `1e`, `0x`) is split at the first character that cannot
//     continue it instead of being reported as an error.
//   - A short string ends at an unescaped newline, as Lua reports an error
//     there; an unterminated long bracket runs to the end of the input.
//   - Names are ASCII letters, digits and underscores. Characters above U+007F
//     are accepted in names for LuaJIT-style sources and never validated.
//   - Standard library names (`print`, `string.format`) get no special token
//     unless called, and `self` and `_ENV` are ordinary identifiers.

import {
  ALNUM,
  DIGIT,
  HEX,
  LETTER,
  enter,
  fallback,
  goto,
  keyword,
  leave,
  match,
  on,
  range,
} from "@twinkleplop/core";

import * as TOKENS from "@twinkleplop/core/tokens";
import { define_grammar } from "@twinkleplop/core/compile";

const NON_ASCII = range([[128, 0xffff]]);
const NAME_START = ["_", LETTER, NON_ASCII];
const NAME_CHAR = ["_", ALNUM, NON_ASCII];
const SPACE = [" ", "\t", "\n", "\r", "\f", "\v"];

// a long bracket delimiter is any run of `=`, so exclude every other printable character
const NOT_EQUALS = Array.from({ length: 94 }, (_, i) => String.fromCharCode(33 + i))
  .filter((c) => c !== "=")
  .join("");

// `start + delimiter + open` is `--[==[`; `close + delimiter + end` is `]==]`
const long_comment = {
  match_delimited: {
    start: "--[",
    open: "[",
    close: "]",
    end: "]",
    max_length: 65535,
    exclude: NOT_EQUALS,
  },
  token: TOKENS.comment,
};

// levels from `[=[` upwards; level 0 is `[[ ]]` and has its own states so that the
// closing bracket stays part of one string token
const long_string = {
  match_delimited: {
    start: "[=",
    open: "[",
    close: "]",
    end: "=]",
    max_length: 65535,
    exclude: NOT_EQUALS,
  },
  token: TOKENS.string,
};

const trivia = [
  on(SPACE),
  long_comment,
  match("--", TOKENS.comment, { ...enter("line_comment"), seal: true }),
];

// punctuation and operators are sealed so neighbours like `))` stay separate tokens
const sealed = { seal: true };

const CALL_OPENERS = ["(", '"', "'", "{", "[[", "[="];

// a name is a call when only whitespace separates it from its arguments. leaving a probe
// with enter keeps the state the probe started in, so main resumes after the name
const call_probes = (name_state: string, call_state: string) => ({
  name_probe: {
    mode: "probe" as const,
    fallback: name_state,
    rules: [
      on(NAME_CHAR),
      on(SPACE, goto("name_probe_space")),
      on(CALL_OPENERS, enter(call_state)),
      fallback(enter(name_state)),
    ],
  },
  name_probe_space: {
    mode: "probe" as const,
    fallback: name_state,
    rules: [on(SPACE), on(CALL_OPENERS, enter(call_state)), fallback(enter(name_state))],
  },
});

const word = (token: string, next_state: string) => ({
  rules: [match(NAME_CHAR, token), fallback(next_state === "" ? leave() : goto(next_state))],
});

const ESCAPE_CHARS = ["a", "b", "f", "n", "r", "t", "v", "\\", '"', "'"];

const short_string = (quote: string) => ({
  rules: [
    match(quote, TOKENS.string, leave()),
    match("\\", TOKENS.string_escape, { ...enter("escape"), seal: true }),
    on(["\n", "\r"], leave()),
    fallback({ token: TOKENS.string }),
  ],
});

export default define_grammar({
  name: "lua",
  states: {
    start: {
      rules: [match("#!", TOKENS.comment, goto("shebang")), fallback(goto("main"))],
    },
    shebang: {
      rules: [on(["\n", "\r"], goto("main")), fallback({ token: TOKENS.comment })],
    },
    main: {
      rules: [
        ...trivia,
        match('"', TOKENS.string, { ...enter("double_quoted"), seal: true }),
        match("'", TOKENS.string, { ...enter("single_quoted"), seal: true }),
        match("[[", TOKENS.string, { ...enter("long_string_body"), seal: true }),
        long_string,
        match(["0x", "0X"], TOKENS.number, { ...enter("hex_integer"), seal: true }),
        match(DIGIT, TOKENS.number, enter("integer")),
        match(
          [".0", ".1", ".2", ".3", ".4", ".5", ".6", ".7", ".8", ".9"],
          TOKENS.number,
          enter("fraction"),
        ),
        keyword(["function"], enter("function_name")),
        keyword(["local"], enter("local_names")),
        keyword(["goto"], enter("goto_label")),
        keyword(["true", "false"], {}, TOKENS.boolean),
        keyword([
          "and",
          "break",
          "do",
          "else",
          "elseif",
          "end",
          "for",
          "if",
          "in",
          "nil",
          "not",
          "or",
          "repeat",
          "return",
          "then",
          "until",
          "while",
        ]),
        on(NAME_START, goto("name_probe")),
        match("::", TOKENS.operator, { ...enter("label_name"), ...sealed }),
        match(
          [
            "+",
            "-",
            "*",
            "/",
            "//",
            "%",
            "^",
            "#",
            "&",
            "~",
            "|",
            "<<",
            ">>",
            "==",
            "~=",
            "<=",
            ">=",
            "<",
            ">",
            "=",
            "..",
            "...",
          ],
          TOKENS.operator,
          sealed,
        ),
        match(["(", ")", "{", "}", "[", "]", ";", ":", ",", "."], TOKENS.punctuation, sealed),
      ],
    },

    line_comment: {
      rules: [on(["\n", "\r"], leave()), fallback({ token: TOKENS.comment })],
    },

    long_string_body: {
      rules: [
        match("]", TOKENS.string, goto("long_string_close")),
        fallback({ token: TOKENS.string }),
      ],
    },
    long_string_close: {
      rules: [match("]", TOKENS.string, leave()), fallback(goto("long_string_body"))],
    },

    double_quoted: short_string('"'),
    single_quoted: short_string("'"),
    escape: {
      rules: [
        match(ESCAPE_CHARS, TOKENS.string_escape, leave()),
        match("\n", TOKENS.string_escape, goto("escape_after_lf")),
        match("\r", TOKENS.string_escape, goto("escape_after_cr")),
        match("x", TOKENS.string_escape, goto("escape_hex_1")),
        match(DIGIT, TOKENS.string_escape, goto("escape_decimal_2")),
        match("u", TOKENS.string_escape, goto("escape_unicode")),
        match("z", TOKENS.string_escape, goto("escape_skip")),
        fallback({ token: TOKENS.string_escape, ...leave() }),
      ],
    },
    escape_after_lf: {
      rules: [match("\r", TOKENS.string_escape, leave()), fallback(leave())],
    },
    escape_after_cr: {
      rules: [match("\n", TOKENS.string_escape, leave()), fallback(leave())],
    },
    escape_hex_1: {
      rules: [match(HEX, TOKENS.string_escape, goto("escape_hex_2")), fallback(leave())],
    },
    escape_hex_2: {
      rules: [match(HEX, TOKENS.string_escape, leave()), fallback(leave())],
    },
    escape_decimal_2: {
      rules: [match(DIGIT, TOKENS.string_escape, goto("escape_decimal_3")), fallback(leave())],
    },
    escape_decimal_3: {
      rules: [match(DIGIT, TOKENS.string_escape, leave()), fallback(leave())],
    },
    escape_unicode: {
      rules: [match("{", TOKENS.string_escape, goto("escape_unicode_digits")), fallback(leave())],
    },
    escape_unicode_digits: {
      rules: [
        match(HEX, TOKENS.string_escape),
        match("}", TOKENS.string_escape, leave()),
        fallback(leave()),
      ],
    },
    escape_skip: {
      rules: [match(SPACE, TOKENS.string_escape), fallback(leave())],
    },

    integer: {
      rules: [
        match(DIGIT, TOKENS.number),
        match(".", TOKENS.number, goto("fraction")),
        match(["e", "E"], TOKENS.number, goto("exponent")),
        fallback(leave()),
      ],
    },
    fraction: {
      rules: [
        match(DIGIT, TOKENS.number),
        match(["e", "E"], TOKENS.number, goto("exponent")),
        fallback(leave()),
      ],
    },
    exponent: {
      rules: [match(["+", "-", DIGIT], TOKENS.number, goto("exponent_digits")), fallback(leave())],
    },
    exponent_digits: {
      rules: [match(DIGIT, TOKENS.number), fallback(leave())],
    },
    hex_integer: {
      rules: [
        match(HEX, TOKENS.number),
        match(".", TOKENS.number, goto("hex_fraction")),
        match(["p", "P"], TOKENS.number, goto("hex_exponent")),
        fallback(leave()),
      ],
    },
    hex_fraction: {
      rules: [
        match(HEX, TOKENS.number),
        match(["p", "P"], TOKENS.number, goto("hex_exponent")),
        fallback(leave()),
      ],
    },
    hex_exponent: {
      rules: [
        match(["+", "-", DIGIT], TOKENS.number, goto("hex_exponent_digits")),
        fallback(leave()),
      ],
    },
    hex_exponent_digits: {
      rules: [match(DIGIT, TOKENS.number), fallback(leave())],
    },

    local_names: {
      rules: [
        ...trivia,
        keyword(["function"], goto("function_name")),
        match(NAME_START, TOKENS.identifier, goto("local_name")),
        fallback(leave()),
      ],
    },
    local_name: word(TOKENS.identifier, "local_after"),
    local_after: {
      rules: [
        ...trivia,
        match("<", TOKENS.punctuation, { ...goto("attrib"), ...sealed }),
        match(",", TOKENS.punctuation, { ...goto("local_names"), ...sealed }),
        fallback(leave()),
      ],
    },
    attrib: {
      rules: [
        ...trivia,
        match(NAME_START, TOKENS.attribute, goto("attrib_name")),
        fallback(goto("local_after")),
      ],
    },
    attrib_name: word(TOKENS.attribute, "attrib_end"),
    attrib_end: {
      rules: [
        ...trivia,
        match(">", TOKENS.punctuation, { ...goto("local_after"), ...sealed }),
        fallback(goto("local_after")),
      ],
    },

    // goto name and ::name::
    goto_label: {
      rules: [...trivia, match(NAME_START, TOKENS.label, goto("goto_name")), fallback(leave())],
    },
    goto_name: word(TOKENS.label, ""),
    label_name: {
      rules: [...trivia, match(NAME_START, TOKENS.label, goto("label_rest")), fallback(leave())],
    },
    label_rest: word(TOKENS.label, "label_end"),
    label_end: {
      rules: [
        ...trivia,
        match("::", TOKENS.operator, { ...leave(), ...sealed }),
        fallback(leave()),
      ],
    },

    ...call_probes("identifier_name", "call_name"),
    identifier_name: word(TOKENS.identifier, ""),
    call_name: word(TOKENS.function, ""),

    // function a.b:c — only the last name is the defined function
    function_name: {
      rules: [...trivia, on(NAME_START, goto("declared_probe")), fallback(leave())],
    },
    declared_probe: {
      mode: "probe",
      fallback: "declared_last",
      rules: [
        on(NAME_CHAR),
        on(SPACE, goto("declared_probe_space")),
        on([".", ":"], goto("declared_path")),
        fallback(goto("declared_last")),
      ],
    },
    declared_probe_space: {
      mode: "probe",
      fallback: "declared_last",
      rules: [on(SPACE), on([".", ":"], goto("declared_path")), fallback(goto("declared_last"))],
    },
    declared_path: word(TOKENS.identifier, "declared_separator"),
    declared_separator: {
      rules: [
        ...trivia,
        match([".", ":"], TOKENS.punctuation, { ...goto("function_name"), ...sealed }),
        fallback(leave()),
      ],
    },
    declared_last: word(TOKENS.function, ""),
  },
});
