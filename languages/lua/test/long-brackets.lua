-- long strings of every level
local a = [[level 0]]
local b = [=[level 1 with ]] inside]=]
local c = [==[level 2 with ]=] and ]] inside]==]
local d = [[
multi
line
]]

--[[ long comment ]] local e = 1
--[==[ level 2 comment ]] ]=] still comment ]==] local f = 2
--[=[
spans
lines
]=]

--[ not a long comment
--[== neither
local g = t[ [[key]] ]
local h = t[u[1]]
