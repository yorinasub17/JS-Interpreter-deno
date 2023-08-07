# JS-Interpreter-deno

Deno library for using [NeilFraser/JS-Interpreter](https://github.com/NeilFraser/JS-Interpreter). This is a thin wrapper
on top of the original JavaScript library to make it compatible with importing into a Deno environment.

## Quickstart

```deno
import {
  Interpreter,
} from https://raw.githubusercontent.com/yorinasub17/JS-Interpreter-deno/v0.0.1/mod.ts

const myCode = 'var a=1; for(var i=0;i<4;i++){a*=i;} a;';
const myInterpreter = new Interpreter(myCode);
myInterpreter.run();
```

Checkout [the original JS-Interpreter repo](https://github.com/NeilFraser/JS-Interpreter) for more examples.


## Motivation

`JS-Interpreter` is a minimal ES5 runtime for Javascript that provides a secure sandbox with many functionality stripped
(such as making outbound network calls or accessing the filesystem), which provides a stronger guarantee than simply
using `eval` or `Worker` directly.
