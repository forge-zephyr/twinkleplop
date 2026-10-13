export const test = [
	{
		"type": "comment",
		"start": 0,
		"end": 9,
		"match": "-- quotes"
	},
	{
		"type": "keyword",
		"start": 10,
		"end": 15,
		"match": "local"
	},
	{
		"type": "identifier",
		"start": 16,
		"end": 17,
		"match": "a"
	},
	{
		"type": "operator",
		"start": 18,
		"end": 19,
		"match": "="
	},
	{
		"type": "string",
		"start": 20,
		"end": 28,
		"match": "\"double\""
	},
	{
		"type": "keyword",
		"start": 29,
		"end": 34,
		"match": "local"
	},
	{
		"type": "identifier",
		"start": 35,
		"end": 36,
		"match": "b"
	},
	{
		"type": "operator",
		"start": 37,
		"end": 38,
		"match": "="
	},
	{
		"type": "string",
		"start": 39,
		"end": 47,
		"match": "'single'"
	},
	{
		"type": "keyword",
		"start": 48,
		"end": 53,
		"match": "local"
	},
	{
		"type": "identifier",
		"start": 54,
		"end": 55,
		"match": "c"
	},
	{
		"type": "operator",
		"start": 56,
		"end": 57,
		"match": "="
	},
	{
		"type": "string",
		"start": 58,
		"end": 64,
		"match": "\"it's\""
	},
	{
		"type": "keyword",
		"start": 65,
		"end": 70,
		"match": "local"
	},
	{
		"type": "identifier",
		"start": 71,
		"end": 72,
		"match": "d"
	},
	{
		"type": "operator",
		"start": 73,
		"end": 74,
		"match": "="
	},
	{
		"type": "string",
		"start": 75,
		"end": 85,
		"match": "'say \"hi\"'"
	},
	{
		"type": "comment",
		"start": 87,
		"end": 114,
		"match": "-- single-character escapes"
	},
	{
		"type": "keyword",
		"start": 115,
		"end": 120,
		"match": "local"
	},
	{
		"type": "identifier",
		"start": 121,
		"end": 122,
		"match": "e"
	},
	{
		"type": "operator",
		"start": 123,
		"end": 124,
		"match": "="
	},
	{
		"type": "string",
		"start": 125,
		"end": 126,
		"match": "\""
	},
	{
		"type": "string_escape",
		"start": 126,
		"end": 128,
		"match": "\\a"
	},
	{
		"type": "string_escape",
		"start": 128,
		"end": 130,
		"match": "\\b"
	},
	{
		"type": "string_escape",
		"start": 130,
		"end": 132,
		"match": "\\f"
	},
	{
		"type": "string_escape",
		"start": 132,
		"end": 134,
		"match": "\\n"
	},
	{
		"type": "string_escape",
		"start": 134,
		"end": 136,
		"match": "\\r"
	},
	{
		"type": "string_escape",
		"start": 136,
		"end": 138,
		"match": "\\t"
	},
	{
		"type": "string_escape",
		"start": 138,
		"end": 140,
		"match": "\\v"
	},
	{
		"type": "string_escape",
		"start": 140,
		"end": 142,
		"match": "\\\\"
	},
	{
		"type": "string_escape",
		"start": 142,
		"end": 144,
		"match": "\\\""
	},
	{
		"type": "string_escape",
		"start": 144,
		"end": 146,
		"match": "\\'"
	},
	{
		"type": "string",
		"start": 146,
		"end": 147,
		"match": "\""
	},
	{
		"type": "comment",
		"start": 149,
		"end": 181,
		"match": "-- escapes cannot end the string"
	},
	{
		"type": "keyword",
		"start": 182,
		"end": 187,
		"match": "local"
	},
	{
		"type": "identifier",
		"start": 188,
		"end": 189,
		"match": "f"
	},
	{
		"type": "operator",
		"start": 190,
		"end": 191,
		"match": "="
	},
	{
		"type": "string",
		"start": 192,
		"end": 199,
		"match": "\"quote "
	},
	{
		"type": "string_escape",
		"start": 199,
		"end": 201,
		"match": "\\\""
	},
	{
		"type": "string",
		"start": 201,
		"end": 209,
		"match": " inside\""
	},
	{
		"type": "keyword",
		"start": 210,
		"end": 215,
		"match": "local"
	},
	{
		"type": "identifier",
		"start": 216,
		"end": 217,
		"match": "g"
	},
	{
		"type": "operator",
		"start": 218,
		"end": 219,
		"match": "="
	},
	{
		"type": "string",
		"start": 220,
		"end": 227,
		"match": "'quote "
	},
	{
		"type": "string_escape",
		"start": 227,
		"end": 229,
		"match": "\\'"
	},
	{
		"type": "string",
		"start": 229,
		"end": 237,
		"match": " inside'"
	},
	{
		"type": "keyword",
		"start": 238,
		"end": 243,
		"match": "local"
	},
	{
		"type": "identifier",
		"start": 244,
		"end": 245,
		"match": "h"
	},
	{
		"type": "operator",
		"start": 246,
		"end": 247,
		"match": "="
	},
	{
		"type": "string",
		"start": 248,
		"end": 268,
		"match": "\"trailing backslash "
	},
	{
		"type": "string_escape",
		"start": 268,
		"end": 270,
		"match": "\\\\"
	},
	{
		"type": "string",
		"start": 270,
		"end": 271,
		"match": "\""
	},
	{
		"type": "comment",
		"start": 273,
		"end": 291,
		"match": "-- numeric escapes"
	},
	{
		"type": "keyword",
		"start": 292,
		"end": 297,
		"match": "local"
	},
	{
		"type": "identifier",
		"start": 298,
		"end": 299,
		"match": "i"
	},
	{
		"type": "operator",
		"start": 300,
		"end": 301,
		"match": "="
	},
	{
		"type": "string",
		"start": 302,
		"end": 303,
		"match": "\""
	},
	{
		"type": "string_escape",
		"start": 303,
		"end": 307,
		"match": "\\x41"
	},
	{
		"type": "string_escape",
		"start": 307,
		"end": 311,
		"match": "\\xfF"
	},
	{
		"type": "string",
		"start": 311,
		"end": 312,
		"match": " "
	},
	{
		"type": "string_escape",
		"start": 312,
		"end": 315,
		"match": "\\65"
	},
	{
		"type": "string",
		"start": 315,
		"end": 316,
		"match": " "
	},
	{
		"type": "string_escape",
		"start": 316,
		"end": 320,
		"match": "\\065"
	},
	{
		"type": "string",
		"start": 320,
		"end": 321,
		"match": " "
	},
	{
		"type": "string_escape",
		"start": 321,
		"end": 323,
		"match": "\\0"
	},
	{
		"type": "string",
		"start": 323,
		"end": 324,
		"match": " "
	},
	{
		"type": "string_escape",
		"start": 324,
		"end": 330,
		"match": "\\u{48}"
	},
	{
		"type": "string",
		"start": 330,
		"end": 331,
		"match": " "
	},
	{
		"type": "string_escape",
		"start": 331,
		"end": 340,
		"match": "\\u{1F600}"
	},
	{
		"type": "string",
		"start": 340,
		"end": 341,
		"match": " "
	},
	{
		"type": "string_escape",
		"start": 341,
		"end": 353,
		"match": "\\u{7FFFFFFF}"
	},
	{
		"type": "string",
		"start": 353,
		"end": 354,
		"match": "\""
	},
	{
		"type": "comment",
		"start": 356,
		"end": 393,
		"match": "-- backslash before a newline, and \\z"
	},
	{
		"type": "keyword",
		"start": 394,
		"end": 399,
		"match": "local"
	},
	{
		"type": "identifier",
		"start": 400,
		"end": 401,
		"match": "j"
	},
	{
		"type": "operator",
		"start": 402,
		"end": 403,
		"match": "="
	},
	{
		"type": "string",
		"start": 404,
		"end": 414,
		"match": "\"line one "
	},
	{
		"type": "string_escape",
		"start": 414,
		"end": 416,
		"match": "\\\n"
	},
	{
		"type": "string",
		"start": 416,
		"end": 425,
		"match": "line two\""
	},
	{
		"type": "keyword",
		"start": 426,
		"end": 431,
		"match": "local"
	},
	{
		"type": "identifier",
		"start": 432,
		"end": 433,
		"match": "k"
	},
	{
		"type": "operator",
		"start": 434,
		"end": 435,
		"match": "="
	},
	{
		"type": "string",
		"start": 436,
		"end": 443,
		"match": "\"skips "
	},
	{
		"type": "string_escape",
		"start": 443,
		"end": 458,
		"match": "\\z\n            "
	},
	{
		"type": "string",
		"start": 458,
		"end": 474,
		"match": "the indentation\""
	},
	{
		"type": "comment",
		"start": 476,
		"end": 491,
		"match": "-- unterminated"
	},
	{
		"type": "keyword",
		"start": 492,
		"end": 497,
		"match": "local"
	},
	{
		"type": "identifier",
		"start": 498,
		"end": 499,
		"match": "l"
	},
	{
		"type": "operator",
		"start": 500,
		"end": 501,
		"match": "="
	},
	{
		"type": "string",
		"start": 502,
		"end": 519,
		"match": "\"no closing quote"
	},
	{
		"type": "function",
		"start": 520,
		"end": 525,
		"match": "print"
	},
	{
		"type": "punctuation",
		"start": 525,
		"end": 526,
		"match": "("
	},
	{
		"type": "identifier",
		"start": 526,
		"end": 527,
		"match": "l"
	},
	{
		"type": "punctuation",
		"start": 527,
		"end": 528,
		"match": ")"
	}
];
