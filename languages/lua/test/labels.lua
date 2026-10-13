-- continue idiom
for i = 1, 10 do
  if i % 2 == 0 then goto continue end
  print(i)
  ::continue::
end

-- spacing, newlines and comments
:: spaced ::
goto
  spaced
::--[[a]] commented --[[b]]::
goto --[[c]] commented

-- a method call is not a label
obj:method()
local t = { a = 1 }
