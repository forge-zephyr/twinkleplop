export const test = [
	{
		"type": "comment",
		"start": 0,
		"end": 30,
		"match": "-- long strings of every level"
	},
	{
		"type": "keyword",
		"start": 31,
		"end": 36,
		"match": "local"
	},
	{
		"type": "identifier",
		"start": 37,
		"end": 38,
		"match": "a"
	},
	{
		"type": "operator",
		"start": 39,
		"end": 40,
		"match": "="
	},
	{
		"type": "string",
		"start": 41,
		"end": 52,
		"match": "[[level 0]]"
	},
	{
		"type": "keyword",
		"start": 53,
		"end": 58,
		"match": "local"
	},
	{
		"type": "identifier",
		"start": 59,
		"end": 60,
		"match": "b"
	},
	{
		"type": "operator",
		"start": 61,
		"end": 62,
		"match": "="
	},
	{
		"type": "string",
		"start": 63,
		"end": 91,
		"match": "[=[level 1 with ]] inside]=]"
	},
	{
		"type": "keyword",
		"start": 92,
		"end": 97,
		"match": "local"
	},
	{
		"type": "identifier",
		"start": 98,
		"end": 99,
		"match": "c"
	},
	{
		"type": "operator",
		"start": 100,
		"end": 101,
		"match": "="
	},
	{
		"type": "string",
		"start": 102,
		"end": 140,
		"match": "[==[level 2 with ]=] and ]] inside]==]"
	},
	{
		"type": "keyword",
		"start": 141,
		"end": 146,
		"match": "local"
	},
	{
		"type": "identifier",
		"start": 147,
		"end": 148,
		"match": "d"
	},
	{
		"type": "operator",
		"start": 149,
		"end": 150,
		"match": "="
	},
	{
		"type": "string",
		"start": 151,
		"end": 167,
		"match": "[[\nmulti\nline\n]]"
	},
	{
		"type": "comment",
		"start": 169,
		"end": 189,
		"match": "--[[ long comment ]]"
	},
	{
		"type": "keyword",
		"start": 190,
		"end": 195,
		"match": "local"
	},
	{
		"type": "identifier",
		"start": 196,
		"end": 197,
		"match": "e"
	},
	{
		"type": "operator",
		"start": 198,
		"end": 199,
		"match": "="
	},
	{
		"type": "number",
		"start": 200,
		"end": 201,
		"match": "1"
	},
	{
		"type": "comment",
		"start": 202,
		"end": 250,
		"match": "--[==[ level 2 comment ]] ]=] still comment ]==]"
	},
	{
		"type": "keyword",
		"start": 251,
		"end": 256,
		"match": "local"
	},
	{
		"type": "identifier",
		"start": 257,
		"end": 258,
		"match": "f"
	},
	{
		"type": "operator",
		"start": 259,
		"end": 260,
		"match": "="
	},
	{
		"type": "number",
		"start": 261,
		"end": 262,
		"match": "2"
	},
	{
		"type": "comment",
		"start": 263,
		"end": 284,
		"match": "--[=[\nspans\nlines\n]=]"
	},
	{
		"type": "comment",
		"start": 286,
		"end": 308,
		"match": "--[ not a long comment"
	},
	{
		"type": "comment",
		"start": 309,
		"end": 322,
		"match": "--[== neither"
	},
	{
		"type": "keyword",
		"start": 323,
		"end": 328,
		"match": "local"
	},
	{
		"type": "identifier",
		"start": 329,
		"end": 330,
		"match": "g"
	},
	{
		"type": "operator",
		"start": 331,
		"end": 332,
		"match": "="
	},
	{
		"type": "identifier",
		"start": 333,
		"end": 334,
		"match": "t"
	},
	{
		"type": "punctuation",
		"start": 334,
		"end": 335,
		"match": "["
	},
	{
		"type": "string",
		"start": 336,
		"end": 343,
		"match": "[[key]]"
	},
	{
		"type": "punctuation",
		"start": 344,
		"end": 345,
		"match": "]"
	},
	{
		"type": "keyword",
		"start": 346,
		"end": 351,
		"match": "local"
	},
	{
		"type": "identifier",
		"start": 352,
		"end": 353,
		"match": "h"
	},
	{
		"type": "operator",
		"start": 354,
		"end": 355,
		"match": "="
	},
	{
		"type": "identifier",
		"start": 356,
		"end": 357,
		"match": "t"
	},
	{
		"type": "punctuation",
		"start": 357,
		"end": 358,
		"match": "["
	},
	{
		"type": "identifier",
		"start": 358,
		"end": 359,
		"match": "u"
	},
	{
		"type": "punctuation",
		"start": 359,
		"end": 360,
		"match": "["
	},
	{
		"type": "number",
		"start": 360,
		"end": 361,
		"match": "1"
	},
	{
		"type": "punctuation",
		"start": 361,
		"end": 362,
		"match": "]"
	},
	{
		"type": "punctuation",
		"start": 362,
		"end": 363,
		"match": "]"
	}
];
