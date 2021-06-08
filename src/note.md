Why does the updatater have to be directly attatched to the state?

Why can't it be like...

let valueHook = hook(value)
value.push(1)
update(valueHook, value)

I guess it's not very nice to use...

