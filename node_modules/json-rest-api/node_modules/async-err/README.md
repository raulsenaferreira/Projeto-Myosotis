async-err
=========

An easy way to make an error in Node.js asynchronous, when it would be
synchronous otherwise.

## Installation

    npm install async-err

## Example - non-throwing

    'use strict';
    var asyncerr = require('./index').asyncerr;
    var fs = require('fs');

    function asyncFunc(filename, cb) {
      if (typeof var1 !== 'string')
        return asyncerr(new Error('Error: Bad type for var1'), cb);

      fs.readFile(filename, function (err, data) {
        if (err) return cb(err);
        cb(null, data);
      });
    }

    asyncFunc(3, function(err, file) {
      if (err) return console.log(err.message);
      console.log('File contents: ', file);
    });

Results in the following output, after you type, `export DEBUG="async-err"`:

    async-err Error: Bad type for var1 +0ms
    Error: Bad type for var1

## API

### asyncerr(err, cb)
A convenience function to make otherwise sync errors async. If you give asyncerr
incorrect arguments, it will send messages to the console via the debug module,
but that's it.

#### Params:
* **Object** *err* A Node.js Error object.
* **Function** *cb* A function object as callback.

### asyncerrThrows(err, cb)
A convenience function to make otherwise sync errors async. If you give it
incorrect arguments, it will throw and exception.

#### Params:
* **Object** *err* A Node.js Error object.
* **Function** *cb* A function object as callback.

## License

The MIT License (MIT)

Copyright (c) 2013 Edmond Meinfelder

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

