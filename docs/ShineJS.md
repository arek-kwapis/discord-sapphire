# ShineJS Specification

## pass(x, y)
sCore | Array with [object] and [string] args

pass() is a function allowing a data type to be passed to a function that is either
inside or out of the specified module

### Usage
#### Passing a `string` to print in current channel
pass("Hello World!", sCore.send(current))