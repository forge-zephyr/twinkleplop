-- quotes
local a = "double"
local b = 'single'
local c = "it's"
local d = 'say "hi"'

-- single-character escapes
local e = "\a\b\f\n\r\t\v\\\"\'"

-- escapes cannot end the string
local f = "quote \" inside"
local g = 'quote \' inside'
local h = "trailing backslash \\"

-- numeric escapes
local i = "\x41\xfF \65 \065 \0 \u{48} \u{1F600} \u{7FFFFFFF}"

-- backslash before a newline, and \z
local j = "line one \
line two"
local k = "skips \z
            the indentation"

-- unterminated
local l = "no closing quote
print(l)
