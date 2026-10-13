import { describe, expect, it, test } from "vitest";
import { tokenize as tokenize_core } from "@twinkleplop/core";
import { verify } from "@twinkleplop/core/compile";
import { grammar, raw_grammar } from "./index.js";
import fs from "node:fs";
import path from "node:path";

const test_dir = path.join(import.meta.dirname, "..", "test");
const outputs = import.meta.glob("../test/*.output.js", { eager: true }) as Record<
  string,
  { test: unknown }
>;

function tokens(input: string) {
  const result = tokenize_core(input, grammar);
  const out = [];
  for (let i = 0; i < result.tokens.length; i += 3) {
    const [type, start, end] = result.tokens.slice(i, i + 3);
    out.push({ type: result.token_types[type], start, end, match: input.slice(start, end) });
  }
  return out;
}

const of_type = (input: string, type: string) =>
  tokens(input)
    .filter((t) => t.type === type)
    .map((t) => t.match);

// the type and text of every token
const pairs = (input: string) => tokens(input).map((t) => [t.type, t.match]);

describe("Lua grammar", () => {
  test("verify", () => expect(verify(raw_grammar)).toEqual([]));

  for (const file of fs.readdirSync(test_dir).filter((file) => file.endsWith(".lua"))) {
    it(`tokenizes ${file}`, () => {
      const input = fs.readFileSync(path.join(test_dir, file), "utf8");
      expect(tokens(input)).toEqual(outputs[`../test/${file.replace(".lua", ".output.js")}`].test);
    });
  }

  describe("long brackets", () => {
    it("tokenizes long strings of every level as one string", () => {
      const strings = ["[[a]]", "[=[b]=]", "[==[c]==]", "[===[d]===]", "[====[e]====]"];
      expect(of_type(strings.map((s, i) => `x${i} = ${s}`).join("\n"), "string")).toEqual(strings);
    });

    it("tokenizes long comments of every level as one comment", () => {
      const comments = ["--[[a]]", "--[=[b]=]", "--[==[c]==]", "--[===[d]===]"];
      const input = comments.map((c) => `${c} x`).join("\n");
      expect(of_type(input, "comment")).toEqual(comments);
      expect(of_type(input, "identifier")).toEqual(["x", "x", "x", "x"]);
    });

    it("ends a long bracket only at a closing bracket of the same level", () => {
      for (let level = 0; level < 5; level++) {
        const equals = "=".repeat(level);
        const others = [0, 1, 2, 3, 4, 5]
          .filter((n) => n !== level)
          .map((n) => `]${"=".repeat(n)}]`);
        const long = `[${equals}[ ${others.join(" ")} ]${equals}]`;
        expect(of_type(`s = ${long} t`, "string")).toEqual([long]);
        expect(of_type(`--${long} t`, "comment")).toEqual([`--${long}`]);
        expect(of_type(`--${long} t`, "identifier")).toEqual(["t"]);
      }
    });

    it("spans lines and resumes code after the closing bracket", () => {
      const input = "a = [==[\nline 1\n]]\nline 2\n]==] b\n--[[\nc\n]] d";
      expect(pairs(input)).toEqual([
        ["identifier", "a"],
        ["operator", "="],
        ["string", "[==[\nline 1\n]]\nline 2\n]==]"],
        ["identifier", "b"],
        ["comment", "--[[\nc\n]]"],
        ["identifier", "d"],
      ]);
    });

    it("ends at the first closing bracket of the right level", () => {
      expect(of_type("x = [[a]]]]", "string")).toEqual(["[[a]]"]);
      expect(of_type("x = [[a]b]c]]", "string")).toEqual(["[[a]b]c]]"]);
      expect(of_type("x = [=[a]]=]=]", "string")).toEqual(["[=[a]]=]"]);
    });

    it("treats a comment that is not a long bracket as a line comment", () => {
      expect(pairs("--[ not\nx\n--[== no\ny\n--[=x\nz")).toEqual([
        ["comment", "--[ not"],
        ["identifier", "x"],
        ["comment", "--[== no"],
        ["identifier", "y"],
        ["comment", "--[=x"],
        ["identifier", "z"],
      ]);
    });

    it("does not read an index as a long bracket", () => {
      expect(of_type("a[b[1]] = c[ [[k]] ]", "string")).toEqual(["[[k]]"]);
      expect(of_type("a[b[1]]", "punctuation")).toEqual(["[", "[", "]", "]"]);
    });

    it("runs an unterminated long bracket to the end of the input", () => {
      expect(of_type("x = [==[ abc ]=] ]]", "string")).toEqual(["[==[ abc ]=] ]]"]);
      expect(of_type("--[[ abc\ndef", "comment")).toEqual(["--[[ abc\ndef"]);
    });

    it("supports very high levels", () => {
      const level = "=".repeat(300);
      const body = ` ]${"=".repeat(299)}] `;
      expect(of_type(`x = [${level}[${body}]${level}] y`, "string")).toEqual([
        `[${level}[${body}]${level}]`,
      ]);
    });
  });

  describe("short strings", () => {
    const escapes = (input: string) => of_type(input, "string_escape");

    it("tokenizes single and double quoted strings", () => {
      expect(pairs(`x = "a b", 'c d'`)).toEqual([
        ["identifier", "x"],
        ["operator", "="],
        ["string", '"a b"'],
        ["punctuation", ","],
        ["string", "'c d'"],
      ]);
    });

    it("tokenizes the single-letter escapes", () => {
      for (const c of ["a", "b", "f", "n", "r", "t", "v", "\\", '"', "'"]) {
        expect(pairs(`"x\\${c}y"`)).toEqual([
          ["string", '"x'],
          ["string_escape", `\\${c}`],
          ["string", 'y"'],
        ]);
      }
    });

    it("never ends a string at an escaped quote", () => {
      expect(pairs(`"a\\"b" x`)).toEqual([
        ["string", '"a'],
        ["string_escape", '\\"'],
        ["string", 'b"'],
        ["identifier", "x"],
      ]);
      expect(pairs(`'a\\'b' x`)).toEqual([
        ["string", "'a"],
        ["string_escape", "\\'"],
        ["string", "b'"],
        ["identifier", "x"],
      ]);
      expect(of_type(`"\\\\" x`, "identifier")).toEqual(["x"]);
    });

    it("tokenizes a backslash before a newline as one escape", () => {
      expect(pairs('"a\\\nb"')).toEqual([
        ["string", '"a'],
        ["string_escape", "\\\n"],
        ["string", 'b"'],
      ]);
      expect(escapes('"a\\\r\nb"')).toEqual(["\\\r\n"]);
      expect(escapes('"a\\\n\rb"')).toEqual(["\\\n\r"]);
      expect(escapes('"a\\\rb"')).toEqual(["\\\r"]);
    });

    it("tokenizes hexadecimal escapes with exactly two digits", () => {
      expect(pairs('"\\x41BC"')).toEqual([
        ["string", '"'],
        ["string_escape", "\\x41"],
        ["string", 'BC"'],
      ]);
      expect(escapes('"\\xfF\\x00"')).toEqual(["\\xfF", "\\x00"]);
    });

    it("tokenizes decimal escapes with one to three digits", () => {
      expect(pairs('"\\0a"')).toEqual([
        ["string", '"'],
        ["string_escape", "\\0"],
        ["string", 'a"'],
      ]);
      expect(escapes('"\\65\\065\\255"')).toEqual(["\\65", "\\065", "\\255"]);
      expect(pairs('"\\0651"')).toEqual([
        ["string", '"'],
        ["string_escape", "\\065"],
        ["string", '1"'],
      ]);
    });

    it("tokenizes unicode escapes", () => {
      expect(pairs('"\\u{48}x"')).toEqual([
        ["string", '"'],
        ["string_escape", "\\u{48}"],
        ["string", 'x"'],
      ]);
      expect(escapes('"\\u{1F600}\\u{7FFFFFFF}"')).toEqual(["\\u{1F600}", "\\u{7FFFFFFF}"]);
    });

    it("tokenizes \\z together with the whitespace it skips", () => {
      expect(pairs('"a\\z \t\n  b"')).toEqual([
        ["string", '"a'],
        ["string_escape", "\\z \t\n  "],
        ["string", 'b"'],
      ]);
      expect(escapes('"a\\z"')).toEqual(["\\z"]);
    });

    it("keeps adjacent escapes as separate tokens", () => {
      expect(escapes('"\\n\\n\\t"')).toEqual(["\\n", "\\n", "\\t"]);
    });

    it("ends a string at an unescaped newline", () => {
      expect(pairs('"abc\nx')).toEqual([
        ["string", '"abc'],
        ["identifier", "x"],
      ]);
    });

    it("tokenizes code after a string", () => {
      expect(pairs(`print("a\\n", 'b')`).map((p) => p[1])).toEqual([
        "print",
        "(",
        '"a',
        "\\n",
        '"',
        ",",
        "'b'",
        ")",
      ]);
    });

    it("keeps tokenizing after many strings and escapes", () => {
      const unit = `s = "a\\n\\x41\\u{41}\\z  \\65" 'b\\'' [[c]] [=[d]=]\n`;
      const result = tokens(unit.repeat(400) + "end_marker");
      expect(result.at(-1)).toMatchObject({ type: "identifier", match: "end_marker" });
      expect(result.filter((t) => t.type === "string_escape")).toHaveLength(400 * 6);
    });
  });
  describe("numerals", () => {
    const numbers = (input: string) => of_type(input, "number");

    it("tokenizes decimal integers", () => {
      expect(pairs("x = 3")).toEqual([
        ["identifier", "x"],
        ["operator", "="],
        ["number", "3"],
      ]);
      expect(numbers("0 10 007 123456789")).toEqual(["0", "10", "007", "123456789"]);
    });

    it("tokenizes decimal floats", () => {
      expect(numbers("3.0 3.1416 3. 0.5")).toEqual(["3.0", "3.1416", "3.", "0.5"]);
    });

    it("tokenizes decimal exponents", () => {
      expect(numbers("3e2 3E2 3e+2 3e-2 0.31416E1 34e1 3.e2 3.5e-10")).toEqual([
        "3e2",
        "3E2",
        "3e+2",
        "3e-2",
        "0.31416E1",
        "34e1",
        "3.e2",
        "3.5e-10",
      ]);
    });

    it("tokenizes a leading dot", () => {
      expect(numbers(".5 .5e3 .5E-3 .0")).toEqual([".5", ".5e3", ".5E-3", ".0"]);
      expect(pairs("x=.5")).toEqual([
        ["identifier", "x"],
        ["operator", "="],
        ["number", ".5"],
      ]);
    });

    it("tokenizes hexadecimal integers", () => {
      expect(numbers("0xff 0XA 0xBEBADA 0x0 0xDeadBeef")).toEqual([
        "0xff",
        "0XA",
        "0xBEBADA",
        "0x0",
        "0xDeadBeef",
      ]);
    });

    it("tokenizes hexadecimal floats and p exponents", () => {
      expect(numbers("0x.1 0xA. 0xA.8 0x0.1E 0XA23p-4 0X1.921FB54442D18P+1 0x1p4 0x.8P1")).toEqual([
        "0x.1",
        "0xA.",
        "0xA.8",
        "0x0.1E",
        "0XA23p-4",
        "0X1.921FB54442D18P+1",
        "0x1p4",
        "0x.8P1",
      ]);
    });

    it("treats e as a digit in hexadecimal and p as the exponent", () => {
      expect(numbers("0xe+1")).toEqual(["0xe", "1"]);
      expect(numbers("0xep1 0x1e+1")).toEqual(["0xep1", "0x1e", "1"]);
    });

    it("does not read a number out of an identifier", () => {
      expect(pairs("a1 _2 x.y")).toEqual([
        ["identifier", "a1"],
        ["identifier", "_2"],
        ["identifier", "x"],
        ["punctuation", "."],
        ["identifier", "y"],
      ]);
    });

    it("keeps a sign after the exponent marker inside the number only", () => {
      expect(pairs("3e-2,1")).toEqual([
        ["number", "3e-2"],
        ["punctuation", ","],
        ["number", "1"],
      ]);
    });

    it("keeps tokenizing after many numerals", () => {
      const unit = "x = 0xA.8p-1 + .5e3 + 12 + 3.e+2\n";
      const result = tokens(unit.repeat(400) + "end_marker");
      expect(result.at(-1)).toMatchObject({ type: "identifier", match: "end_marker" });
      expect(result.filter((t) => t.type === "number")).toHaveLength(400 * 4);
    });
  });
  describe("keywords", () => {
    const KEYWORDS = [
      "and",
      "break",
      "do",
      "else",
      "elseif",
      "end",
      "for",
      "function",
      "goto",
      "if",
      "in",
      "local",
      "nil",
      "not",
      "or",
      "repeat",
      "return",
      "then",
      "until",
      "while",
    ];

    it("tokenizes every keyword", () => {
      for (const word of KEYWORDS) {
        expect(pairs(word)).toEqual([["keyword", word]]);
      }
    });

    it("tokenizes true and false as booleans", () => {
      expect(pairs("true false")).toEqual([
        ["boolean", "true"],
        ["boolean", "false"],
      ]);
    });

    it("does not read a keyword out of a longer name", () => {
      for (const name of ["endx", "format", "do_it", "_end", "end1", "nilly", "trueish", "ifs"]) {
        expect(pairs(`x = ${name}`)).toEqual([
          ["identifier", "x"],
          ["operator", "="],
          ["identifier", name],
        ]);
      }
    });

    it("tokenizes a block of statements", () => {
      expect(
        of_type("if a then return nil elseif not b or c and d then break else end", "keyword"),
      ).toEqual([
        "if",
        "then",
        "return",
        "nil",
        "elseif",
        "not",
        "or",
        "and",
        "then",
        "break",
        "else",
        "end",
      ]);
      expect(of_type("while x do end repeat until y for k in t do end", "keyword")).toEqual([
        "while",
        "do",
        "end",
        "repeat",
        "until",
        "for",
        "in",
        "do",
        "end",
      ]);
    });
  });

  describe("operators", () => {
    const OPERATORS = [
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
      "::",
    ];

    it("tokenizes every operator", () => {
      for (const op of OPERATORS) {
        expect(pairs(op)).toEqual([["operator", op]]);
      }
    });

    it("tokenizes every punctuation character", () => {
      expect(pairs("( ) { } [ ] ; : , .")).toEqual(
        ["(", ")", "{", "}", "[", "]", ";", ":", ",", "."].map((p) => ["punctuation", p]),
      );
    });

    it("takes the longest operator", () => {
      expect(pairs("a//b a~=b a<<b a>>b a<=b a>=b a==b")).toEqual([
        ["identifier", "a"],
        ["operator", "//"],
        ["identifier", "b"],
        ["identifier", "a"],
        ["operator", "~="],
        ["identifier", "b"],
        ["identifier", "a"],
        ["operator", "<<"],
        ["identifier", "b"],
        ["identifier", "a"],
        ["operator", ">>"],
        ["identifier", "b"],
        ["identifier", "a"],
        ["operator", "<="],
        ["identifier", "b"],
        ["identifier", "a"],
        ["operator", ">="],
        ["identifier", "b"],
        ["identifier", "a"],
        ["operator", "=="],
        ["identifier", "b"],
      ]);
    });

    it("keeps unary operators apart from their operand", () => {
      expect(pairs("~a #t -x")).toEqual([
        ["operator", "~"],
        ["identifier", "a"],
        ["operator", "#"],
        ["identifier", "t"],
        ["operator", "-"],
        ["identifier", "x"],
      ]);
      expect(pairs("a=-1")).toEqual([
        ["identifier", "a"],
        ["operator", "="],
        ["operator", "-"],
        ["number", "1"],
      ]);
    });

    it("does not confuse a minus with a comment", () => {
      expect(pairs("a - b -- c")).toEqual([
        ["identifier", "a"],
        ["operator", "-"],
        ["identifier", "b"],
        ["comment", "-- c"],
      ]);
      expect(pairs("a-b")).toEqual([
        ["identifier", "a"],
        ["operator", "-"],
        ["identifier", "b"],
      ]);
    });
  });

  describe("varargs and concatenation", () => {
    it("tokenizes ... as one operator on its own", () => {
      expect(pairs("f(...)")).toEqual([
        ["function", "f"],
        ["punctuation", "("],
        ["operator", "..."],
        ["punctuation", ")"],
      ]);
      expect(pairs("f(a,...)")).toEqual([
        ["function", "f"],
        ["punctuation", "("],
        ["identifier", "a"],
        ["punctuation", ","],
        ["operator", "..."],
        ["punctuation", ")"],
      ]);
      expect(pairs("{...}")).toEqual([
        ["punctuation", "{"],
        ["operator", "..."],
        ["punctuation", "}"],
      ]);
      expect(pairs("(...)")).toEqual([
        ["punctuation", "("],
        ["operator", "..."],
        ["punctuation", ")"],
      ]);
      expect(pairs("function(a, ...) end")).toEqual([
        ["keyword", "function"],
        ["punctuation", "("],
        ["identifier", "a"],
        ["punctuation", ","],
        ["operator", "..."],
        ["punctuation", ")"],
        ["keyword", "end"],
      ]);
    });

    it("tokenizes .. as concatenation", () => {
      expect(pairs("a..b")).toEqual([
        ["identifier", "a"],
        ["operator", ".."],
        ["identifier", "b"],
      ]);
      expect(pairs('"a" .. "b"')).toEqual([
        ["string", '"a"'],
        ["operator", ".."],
        ["string", '"b"'],
      ]);
      expect(pairs("a .. ...")).toEqual([
        ["identifier", "a"],
        ["operator", ".."],
        ["operator", "..."],
      ]);
    });

    it("tokenizes a single dot as punctuation", () => {
      expect(pairs("a.b")).toEqual([
        ["identifier", "a"],
        ["punctuation", "."],
        ["identifier", "b"],
      ]);
    });

    it("keeps tokenizing after many operators", () => {
      const unit = "x = a // b ~= ~c << 1 .. ... >> #t\n";
      const result = tokens(unit.repeat(400) + "end_marker");
      expect(result.at(-1)).toMatchObject({ type: "identifier", match: "end_marker" });
      expect(result.filter((t) => t.type === "operator")).toHaveLength(400 * 9);
    });
  });
  describe("local declarations and attributes", () => {
    it("tokenizes the name in <const> as an attribute", () => {
      expect(pairs("local x <const> = 1")).toEqual([
        ["keyword", "local"],
        ["identifier", "x"],
        ["punctuation", "<"],
        ["attribute", "const"],
        ["punctuation", ">"],
        ["operator", "="],
        ["number", "1"],
      ]);
    });

    it("tokenizes the name in <close> as an attribute", () => {
      expect(pairs("local f <close> = io.open(p)")).toEqual([
        ["keyword", "local"],
        ["identifier", "f"],
        ["punctuation", "<"],
        ["attribute", "close"],
        ["punctuation", ">"],
        ["operator", "="],
        ["identifier", "io"],
        ["punctuation", "."],
        ["function", "open"],
        ["punctuation", "("],
        ["identifier", "p"],
        ["punctuation", ")"],
      ]);
    });

    it("allows whitespace, newlines and comments inside the attribute", () => {
      expect(of_type("local x < const > = 1", "attribute")).toEqual(["const"]);
      expect(of_type("local x\n<\nclose\n>\n= 1", "attribute")).toEqual(["close"]);
      expect(of_type("local x --[[a]] <--[[b]] const --[[c]] > = 1", "attribute")).toEqual([
        "const",
      ]);
      expect(of_type("local x <const>=1", "attribute")).toEqual(["const"]);
    });

    it("tokenizes an attribute on each name of a list", () => {
      expect(pairs("local a <const>, b, c <close> = 1, 2, 3")).toEqual([
        ["keyword", "local"],
        ["identifier", "a"],
        ["punctuation", "<"],
        ["attribute", "const"],
        ["punctuation", ">"],
        ["punctuation", ","],
        ["identifier", "b"],
        ["punctuation", ","],
        ["identifier", "c"],
        ["punctuation", "<"],
        ["attribute", "close"],
        ["punctuation", ">"],
        ["operator", "="],
        ["number", "1"],
        ["punctuation", ","],
        ["number", "2"],
        ["punctuation", ","],
        ["number", "3"],
      ]);
    });

    it("does not treat comparisons as attributes", () => {
      expect(of_type("local x = a < b", "attribute")).toEqual([]);
      expect(of_type("if a < b and c > d then end", "attribute")).toEqual([]);
      expect(of_type("local x = 1 < y > z", "attribute")).toEqual([]);
      expect(of_type("local x\nx = a < b", "attribute")).toEqual([]);
    });

    it("keeps other declarations as identifiers", () => {
      expect(pairs("local a, b")).toEqual([
        ["keyword", "local"],
        ["identifier", "a"],
        ["punctuation", ","],
        ["identifier", "b"],
      ]);
      expect(pairs("local x = 1")).toEqual([
        ["keyword", "local"],
        ["identifier", "x"],
        ["operator", "="],
        ["number", "1"],
      ]);
    });

    it("continues normally after the declaration", () => {
      expect(pairs("local x <const> = 1\nprint(x)").slice(-4)).toEqual([
        ["function", "print"],
        ["punctuation", "("],
        ["identifier", "x"],
        ["punctuation", ")"],
      ]);
    });

    it("keeps tokenizing after many declarations", () => {
      const unit = "local a <const>, b <close>, c = 1, 2, 3\n";
      const result = tokens(unit.repeat(400) + "end_marker");
      expect(result.at(-1)).toMatchObject({ type: "identifier", match: "end_marker" });
      expect(result.filter((t) => t.type === "attribute")).toHaveLength(400 * 2);
    });
  });
  describe("labels", () => {
    it("tokenizes the name in ::name:: as a label", () => {
      expect(pairs("::done::")).toEqual([
        ["operator", "::"],
        ["label", "done"],
        ["operator", "::"],
      ]);
      expect(pairs("::a1_B::")).toEqual([
        ["operator", "::"],
        ["label", "a1_B"],
        ["operator", "::"],
      ]);
    });

    it("tokenizes the name after goto as a label", () => {
      expect(pairs("goto done")).toEqual([
        ["keyword", "goto"],
        ["label", "done"],
      ]);
      expect(pairs("goto\n  continue\nx = 1")).toEqual([
        ["keyword", "goto"],
        ["label", "continue"],
        ["identifier", "x"],
        ["operator", "="],
        ["number", "1"],
      ]);
    });

    it("allows whitespace and comments around a label name", () => {
      expect(pairs(":: spaced ::")).toEqual([
        ["operator", "::"],
        ["label", "spaced"],
        ["operator", "::"],
      ]);
      expect(of_type("::--[[a]] name --[[b]]::", "label")).toEqual(["name"]);
      expect(of_type("goto --[[a]] name", "label")).toEqual(["name"]);
      expect(of_type("goto -- line\n name", "label")).toEqual(["name"]);
    });

    it("pairs a goto with its label in a loop", () => {
      const input =
        "for i = 1, 3 do\n  if i == 2 then goto continue end\n  print(i)\n  ::continue::\nend";
      expect(of_type(input, "label")).toEqual(["continue", "continue"]);
      expect(of_type(input, "identifier")).toEqual(["i", "i", "i"]);
      expect(of_type(input, "function")).toEqual(["print"]);
    });

    it("does not read a label out of a method call or a single colon", () => {
      expect(of_type("obj:method()", "label")).toEqual([]);
      expect(pairs("a:b")).toEqual([
        ["identifier", "a"],
        ["punctuation", ":"],
        ["identifier", "b"],
      ]);
    });

    it("keeps names that start with goto as identifiers", () => {
      expect(pairs("gotox = 1")).toEqual([
        ["identifier", "gotox"],
        ["operator", "="],
        ["number", "1"],
      ]);
    });

    it("keeps tokenizing after many labels", () => {
      const unit = "::a:: goto b ::c::\n";
      const result = tokens(unit.repeat(400) + "end_marker");
      expect(result.at(-1)).toMatchObject({ type: "identifier", match: "end_marker" });
      expect(result.filter((t) => t.type === "label")).toHaveLength(400 * 3);
    });
  });
  describe("function names and calls", () => {
    const functions = (input: string) => of_type(input, "function");

    it("tokenizes the name after function as a function", () => {
      expect(pairs("function name() end")).toEqual([
        ["keyword", "function"],
        ["function", "name"],
        ["punctuation", "("],
        ["punctuation", ")"],
        ["keyword", "end"],
      ]);
    });

    it("tokenizes the name after local function as a function", () => {
      expect(pairs("local function helper(a, b) end")).toEqual([
        ["keyword", "local"],
        ["keyword", "function"],
        ["function", "helper"],
        ["punctuation", "("],
        ["identifier", "a"],
        ["punctuation", ","],
        ["identifier", "b"],
        ["punctuation", ")"],
        ["keyword", "end"],
      ]);
    });

    it("tokenizes only the last name of a dotted function name", () => {
      expect(pairs("function a.b.c() end")).toEqual([
        ["keyword", "function"],
        ["identifier", "a"],
        ["punctuation", "."],
        ["identifier", "b"],
        ["punctuation", "."],
        ["function", "c"],
        ["punctuation", "("],
        ["punctuation", ")"],
        ["keyword", "end"],
      ]);
    });

    it("tokenizes the method name of function a.b:c", () => {
      expect(pairs("function a.b:c(self) end")).toEqual([
        ["keyword", "function"],
        ["identifier", "a"],
        ["punctuation", "."],
        ["identifier", "b"],
        ["punctuation", ":"],
        ["function", "c"],
        ["punctuation", "("],
        ["identifier", "self"],
        ["punctuation", ")"],
        ["keyword", "end"],
      ]);
      expect(functions("function Account:deposit(v) end")).toEqual(["deposit"]);
    });

    it("allows whitespace and comments inside a function name", () => {
      expect(functions("function a . b : c ()")).toEqual(["c"]);
      expect(functions("function\n  a\n  .b\n  :c\n()")).toEqual(["c"]);
      expect(functions("function --[[x]] name --[[y]] ()")).toEqual(["name"]);
      expect(of_type("function a.b.c()", "identifier")).toEqual(["a", "b"]);
    });

    it("tokenizes a called name as a function", () => {
      expect(pairs("f()")).toEqual([
        ["function", "f"],
        ["punctuation", "("],
        ["punctuation", ")"],
      ]);
      expect(pairs("print(x)")).toEqual([
        ["function", "print"],
        ["punctuation", "("],
        ["identifier", "x"],
        ["punctuation", ")"],
      ]);
    });

    it("tokenizes the method of a method call as a function", () => {
      expect(pairs("obj:method(1)")).toEqual([
        ["identifier", "obj"],
        ["punctuation", ":"],
        ["function", "method"],
        ["punctuation", "("],
        ["number", "1"],
        ["punctuation", ")"],
      ]);
    });

    it("tokenizes the last name of a dotted call as a function", () => {
      expect(pairs("string.format('%d', 1)").slice(0, 3)).toEqual([
        ["identifier", "string"],
        ["punctuation", "."],
        ["function", "format"],
      ]);
      expect(functions("a.b.c.d()")).toEqual(["d"]);
      expect(of_type("a.b.c.d()", "identifier")).toEqual(["a", "b", "c"]);
    });

    it("tokenizes calls with a string, table or long string argument", () => {
      expect(functions('f"str"')).toEqual(["f"]);
      expect(functions("f'str'")).toEqual(["f"]);
      expect(functions("f{1, 2}")).toEqual(["f"]);
      expect(functions("f[[str]]")).toEqual(["f"]);
      expect(functions("f[=[str]=]")).toEqual(["f"]);
      expect(functions("f[==[str]==]")).toEqual(["f"]);
      expect(functions("obj:m'x' obj:n{} obj:o[[x]]")).toEqual(["m", "n", "o"]);
    });

    it("allows whitespace and newlines before the arguments", () => {
      expect(functions("f (x)")).toEqual(["f"]);
      expect(functions("f\t\n  (x)")).toEqual(["f"]);
      expect(functions('f "x"')).toEqual(["f"]);
      expect(functions("f {x}")).toEqual(["f"]);
      expect(functions("f [[x]]")).toEqual(["f"]);
      expect(functions("f\r\n[=[x]=]")).toEqual(["f"]);
    });

    it("keeps names that are not called as identifiers", () => {
      expect(of_type("x = y", "function")).toEqual([]);
      expect(of_type("local g = print", "function")).toEqual([]);
      expect(of_type("t.field = 1", "function")).toEqual([]);
      expect(of_type("a[1] = b[c]", "function")).toEqual([]);
      expect(of_type("a [1]", "function")).toEqual([]);
      expect(of_type("t[ [[k]] ]", "function")).toEqual([]);
      expect(of_type("f", "function")).toEqual([]);
      expect(of_type("f   ", "function")).toEqual([]);
      expect(pairs("f")).toEqual([["identifier", "f"]]);
    });

    it("keeps keywords before a parenthesis as keywords", () => {
      expect(pairs("if(x)then return(y) end")).toEqual([
        ["keyword", "if"],
        ["punctuation", "("],
        ["identifier", "x"],
        ["punctuation", ")"],
        ["keyword", "then"],
        ["keyword", "return"],
        ["punctuation", "("],
        ["identifier", "y"],
        ["punctuation", ")"],
        ["keyword", "end"],
      ]);
      expect(pairs("not(x) and(y)").map((p) => p[0])).toEqual([
        "keyword",
        "punctuation",
        "identifier",
        "punctuation",
        "keyword",
        "punctuation",
        "identifier",
        "punctuation",
      ]);
    });

    it("tokenizes an anonymous function without a function name", () => {
      expect(pairs("local f = function(a) end")).toEqual([
        ["keyword", "local"],
        ["identifier", "f"],
        ["operator", "="],
        ["keyword", "function"],
        ["punctuation", "("],
        ["identifier", "a"],
        ["punctuation", ")"],
        ["keyword", "end"],
      ]);
    });

    it("tokenizes nested and chained calls", () => {
      expect(functions("f(g(h(1)))")).toEqual(["f", "g", "h"]);
      expect(functions("a:b():c():d()")).toEqual(["b", "c", "d"]);
      expect(functions("x = f(1) + g(2)")).toEqual(["f", "g"]);
    });

    it("tokenizes non-ASCII names", () => {
      expect(functions("função(1)")).toEqual(["função"]);
      expect(functions("function 名前() end")).toEqual(["名前"]);
      expect(of_type("naïve = 1", "identifier")).toEqual(["naïve"]);
    });

    it("tokenizes definitions inside blocks and calls inside definitions", () => {
      const input =
        "local function outer()\n  local function inner() return f(1) end\n  return inner\nend";
      expect(functions(input)).toEqual(["outer", "inner", "f"]);
      expect(of_type(input, "identifier")).toEqual(["inner"]);
    });

    it("keeps tokenizing after many names and calls", () => {
      const unit = "function a.b:c() end local function d() end f(g) h'x' k{} m [[y]]\n";
      const result = tokens(unit.repeat(400) + "end_marker");
      expect(result.at(-1)).toMatchObject({ type: "identifier", match: "end_marker" });
      expect(result.filter((t) => t.type === "function")).toHaveLength(400 * 6);
    });
  });
});
