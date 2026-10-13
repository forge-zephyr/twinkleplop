-- arithmetic, bitwise, comparison and logical operators
local a = 1 + 2 - 3 * 4 / 5 // 6 % 7 ^ 8
local b = 1 & 2 | 3 ~ 4 << 5 >> 6
local c = ~7
local d = a == b or a ~= b
local e = a < b and a <= b and a > b and a >= b
local f = not (#t == 0)
local g = -x

-- concatenation and varargs
local h = "a" .. "b" .. 1 .. 2
local function vararg(first, ...)
  local t = { ... }
  return select("#", ...), first, (...)
end

-- unary minus is not a comment
local i = a - -b -- trailing comment
local j = a-b
local k = x--[[inline]]+y
