-- definitions
function name() end
local function helper(a, b) return a + b end
function a.b.c() end
function Account.new(balance) return { balance = balance } end
function Account:deposit(value) self.balance = self.balance + value end
function a.b:method(...) end
function  spaced . path : last ( ) end

-- calls
print("hello")
helper(1, 2)
string.format("%d", 7)
obj:method(1)
obj:chain():again():done()
f"string argument"
f'single quoted'
f{ 1, 2, 3 }
f[[long string]]
f[==[level two]==]
f
  (separated)
require "module"
local result = compute(first(1), second(2))

-- not calls
local g = print
local value = table.field
local item = list[1]
local key = list[ [[k]] ]
local anonymous = function(x) return x end
if (g) then return (value) end
