#!/usr/bin/env lua
--[==[ Lua 5.4 tour
  ]] a closing bracket of another level does not end this comment ]=]
]==]

local Account <const> = {}
Account.__index = Account

-- constructors, methods and a vararg collector
function Account.new(owner, balance)
  return setmetatable({ owner = owner, balance = balance or 0 }, Account)
end

function Account:deposit(amount)
  if amount <= 0 then
    error("deposit must be positive: " .. tostring(amount))
  end
  self.balance = self.balance + amount
  return self
end

local function sum(...)
  local total = 0
  for _, value in ipairs({ ... }) do
    total = total + value
  end
  return total, select("#", ...)
end

-- numerals
local numbers = { 42, 3.14, .5e3, 0xFF, 0xA.8p1, 1e-9, 7 // 2, 7 % 2, 2 ^ 10 }
local bits = (0xF0 & 0x3C) | (1 << 4) ~ ~0 >> 1

-- strings and escapes
local greeting = "tab\there, \x41\65\u{1F600}, quote \" and \z
                  continued"
local raw = [=[ long string with ]] inside ]=]

-- to-be-closed variable and a goto-based continue
do
  local log <close> = setmetatable({}, { __close = function() print "closed" end })
  for i = 1, 10 do
    if i % 2 == 0 then goto continue end
    print(i, #raw, greeting:upper(), sum(i, i))
    ::continue::
  end
end

print(Account.new("ada"):deposit(10).balance, nil == false, not true)
