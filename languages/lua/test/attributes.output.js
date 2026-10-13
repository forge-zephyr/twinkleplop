export const test = [
	{
		"type": "keyword",
		"start": 0,
		"end": 5,
		"match": "local"
	},
	{
		"type": "identifier",
		"start": 6,
		"end": 7,
		"match": "x"
	},
	{
		"type": "punctuation",
		"start": 8,
		"end": 9,
		"match": "<"
	},
	{
		"type": "attribute",
		"start": 9,
		"end": 14,
		"match": "const"
	},
	{
		"type": "punctuation",
		"start": 14,
		"end": 15,
		"match": ">"
	},
	{
		"type": "operator",
		"start": 16,
		"end": 17,
		"match": "="
	},
	{
		"type": "number",
		"start": 18,
		"end": 19,
		"match": "1"
	},
	{
		"type": "keyword",
		"start": 20,
		"end": 25,
		"match": "local"
	},
	{
		"type": "identifier",
		"start": 26,
		"end": 27,
		"match": "f"
	},
	{
		"type": "punctuation",
		"start": 28,
		"end": 29,
		"match": "<"
	},
	{
		"type": "attribute",
		"start": 29,
		"end": 34,
		"match": "close"
	},
	{
		"type": "punctuation",
		"start": 34,
		"end": 35,
		"match": ">"
	},
	{
		"type": "operator",
		"start": 36,
		"end": 37,
		"match": "="
	},
	{
		"type": "identifier",
		"start": 38,
		"end": 40,
		"match": "io"
	},
	{
		"type": "punctuation",
		"start": 40,
		"end": 41,
		"match": "."
	},
	{
		"type": "function",
		"start": 41,
		"end": 45,
		"match": "open"
	},
	{
		"type": "punctuation",
		"start": 45,
		"end": 46,
		"match": "("
	},
	{
		"type": "string",
		"start": 46,
		"end": 55,
		"match": "\"log.txt\""
	},
	{
		"type": "punctuation",
		"start": 55,
		"end": 56,
		"match": ")"
	},
	{
		"type": "keyword",
		"start": 57,
		"end": 62,
		"match": "local"
	},
	{
		"type": "identifier",
		"start": 63,
		"end": 64,
		"match": "a"
	},
	{
		"type": "punctuation",
		"start": 65,
		"end": 66,
		"match": "<"
	},
	{
		"type": "attribute",
		"start": 66,
		"end": 71,
		"match": "const"
	},
	{
		"type": "punctuation",
		"start": 71,
		"end": 72,
		"match": ">"
	},
	{
		"type": "punctuation",
		"start": 72,
		"end": 73,
		"match": ","
	},
	{
		"type": "identifier",
		"start": 74,
		"end": 75,
		"match": "b"
	},
	{
		"type": "punctuation",
		"start": 75,
		"end": 76,
		"match": ","
	},
	{
		"type": "identifier",
		"start": 77,
		"end": 78,
		"match": "c"
	},
	{
		"type": "punctuation",
		"start": 79,
		"end": 80,
		"match": "<"
	},
	{
		"type": "attribute",
		"start": 80,
		"end": 85,
		"match": "close"
	},
	{
		"type": "punctuation",
		"start": 85,
		"end": 86,
		"match": ">"
	},
	{
		"type": "operator",
		"start": 87,
		"end": 88,
		"match": "="
	},
	{
		"type": "number",
		"start": 89,
		"end": 90,
		"match": "1"
	},
	{
		"type": "punctuation",
		"start": 90,
		"end": 91,
		"match": ","
	},
	{
		"type": "number",
		"start": 92,
		"end": 93,
		"match": "2"
	},
	{
		"type": "punctuation",
		"start": 93,
		"end": 94,
		"match": ","
	},
	{
		"type": "number",
		"start": 95,
		"end": 96,
		"match": "3"
	},
	{
		"type": "comment",
		"start": 98,
		"end": 142,
		"match": "-- spacing and comments inside the attribute"
	},
	{
		"type": "keyword",
		"start": 143,
		"end": 148,
		"match": "local"
	},
	{
		"type": "identifier",
		"start": 149,
		"end": 150,
		"match": "y"
	},
	{
		"type": "punctuation",
		"start": 151,
		"end": 152,
		"match": "<"
	},
	{
		"type": "attribute",
		"start": 153,
		"end": 158,
		"match": "const"
	},
	{
		"type": "punctuation",
		"start": 159,
		"end": 160,
		"match": ">"
	},
	{
		"type": "operator",
		"start": 161,
		"end": 162,
		"match": "="
	},
	{
		"type": "number",
		"start": 163,
		"end": 164,
		"match": "2"
	},
	{
		"type": "keyword",
		"start": 165,
		"end": 170,
		"match": "local"
	},
	{
		"type": "identifier",
		"start": 171,
		"end": 172,
		"match": "z"
	},
	{
		"type": "punctuation",
		"start": 173,
		"end": 174,
		"match": "<"
	},
	{
		"type": "comment",
		"start": 174,
		"end": 183,
		"match": "--[[why]]"
	},
	{
		"type": "attribute",
		"start": 184,
		"end": 189,
		"match": "const"
	},
	{
		"type": "comment",
		"start": 190,
		"end": 203,
		"match": "--[[because]]"
	},
	{
		"type": "punctuation",
		"start": 204,
		"end": 205,
		"match": ">"
	},
	{
		"type": "operator",
		"start": 206,
		"end": 207,
		"match": "="
	},
	{
		"type": "number",
		"start": 208,
		"end": 209,
		"match": "3"
	},
	{
		"type": "comment",
		"start": 211,
		"end": 244,
		"match": "-- comparisons are not attributes"
	},
	{
		"type": "keyword",
		"start": 245,
		"end": 250,
		"match": "local"
	},
	{
		"type": "identifier",
		"start": 251,
		"end": 253,
		"match": "ok"
	},
	{
		"type": "operator",
		"start": 254,
		"end": 255,
		"match": "="
	},
	{
		"type": "identifier",
		"start": 256,
		"end": 257,
		"match": "x"
	},
	{
		"type": "operator",
		"start": 258,
		"end": 259,
		"match": "<"
	},
	{
		"type": "number",
		"start": 260,
		"end": 261,
		"match": "2"
	},
	{
		"type": "keyword",
		"start": 262,
		"end": 265,
		"match": "and"
	},
	{
		"type": "number",
		"start": 266,
		"end": 267,
		"match": "3"
	},
	{
		"type": "operator",
		"start": 268,
		"end": 269,
		"match": ">"
	},
	{
		"type": "identifier",
		"start": 270,
		"end": 271,
		"match": "y"
	},
	{
		"type": "keyword",
		"start": 272,
		"end": 277,
		"match": "local"
	},
	{
		"type": "identifier",
		"start": 278,
		"end": 279,
		"match": "p"
	},
	{
		"type": "punctuation",
		"start": 279,
		"end": 280,
		"match": ","
	},
	{
		"type": "identifier",
		"start": 281,
		"end": 282,
		"match": "q"
	},
	{
		"type": "keyword",
		"start": 283,
		"end": 285,
		"match": "if"
	},
	{
		"type": "identifier",
		"start": 286,
		"end": 287,
		"match": "p"
	},
	{
		"type": "operator",
		"start": 288,
		"end": 289,
		"match": "<"
	},
	{
		"type": "identifier",
		"start": 290,
		"end": 291,
		"match": "q"
	},
	{
		"type": "keyword",
		"start": 292,
		"end": 296,
		"match": "then"
	},
	{
		"type": "keyword",
		"start": 297,
		"end": 300,
		"match": "end"
	}
];
