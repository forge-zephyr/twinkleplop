local x <const> = 1
local f <close> = io.open("log.txt")
local a <const>, b, c <close> = 1, 2, 3

-- spacing and comments inside the attribute
local y < const > = 2
local z <--[[why]] const --[[because]] > = 3

-- comparisons are not attributes
local ok = x < 2 and 3 > y
local p, q
if p < q then end
