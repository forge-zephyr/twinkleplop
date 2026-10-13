#!/usr/bin/env lua
-- every keyword
if a then
  return nil
elseif not b or c and d then
  goto done
else
  while x do
    break
  end
end

repeat
  local n = n + 1
until n > 10

for i = 1, 10 do
  print(i)
end

for k, v in pairs(t) do
  print(k, v)
end

do
  local ok = true
  local bad = false
end

function f() end
::done::

-- names that merely start with a keyword
local endx, format, do_it, nilly, trueish = 1, 2, 3, 4, 5
