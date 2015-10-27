[![Build Status](https://travis-ci.org/kaelzhang/node-run-mocha-cases.svg?branch=master)](https://travis-ci.org/kaelzhang/node-run-mocha-cases)
<!-- optional npm version
[![NPM version](https://badge.fury.io/js/run-mocha-cases.svg)](http://badge.fury.io/js/run-mocha-cases)
-->
<!-- optional npm downloads
[![npm module downloads per month](http://img.shields.io/npm/dm/run-mocha-cases.svg)](https://www.npmjs.org/package/run-mocha-cases)
-->
<!-- optional dependency status
[![Dependency Status](https://david-dm.org/kaelzhang/node-run-mocha-cases.svg)](https://david-dm.org/kaelzhang/node-run-mocha-cases)
-->

# run-mocha-cases

Run an array list of similar mocha cases, making your test cases more readable and maintainable.

## Install

```sh
$ npm install run-mocha-cases --save
```

## Usage

In your test/test.js:

```js
var run = require('run-mocha-cases');
run('my test case')
  .run(funtion(n){
    if (n < 0) {
      throw new Error('n should not less than 0');
    }
    return n + 1;
  })
  .go(cases);
```

### The `cases`

We could write test cases in a neet and handy way. 

```js
var cases = [

// The fist test case is equivalent to:
// ```js
// it('plus', function(){
//   function runner(n){
//     if (n < 0) {
//       throw new Error('n should not less than 0');
//     }
//     return n + 1;
//   }
//
//   var result = runner(1);
//   expect(result).to.equal(2);
// });
// ```
{
  description: 'plus',
  args: 1,
  expect: 2
},

{
  // Short cut
  d: 'shortcut',
  // Shortcut for `args`
  a: [1],
  // Shortcut for `expect`
  // `expect` could be a function,
  // and you could use any assertion method inside it.
  e: function(n){
    require('chai').expect(n).to.equal();
  }
},

{
  d: 'throw errors',
  a: -1,
  // or `err`
  error: true
},

// This test case will fail if not skipped
{
  d: 'if `error` is not set to `true`, the test case will fail',
  a: -1
},

{
  d: 'async test case',
  a: 1,
  // The shortcut is `r`
  // It will override the default runner which specified by `.run()` 
  run: function(n){
    // Uses the common `this.async()` style to 
    // turn the runner into an asynchronous method.
    var done = this.async();

    setTimeout(function(){
      done(n + 1);
    }, 10);
  },
  expect: 2
}, 

{
  d: 'will use deep equal for object result',
  a: {},
  r: function (obj){
    obj.a = 1;
    return obj;
  },
  e: {
    a: 1
  }
},

// {
//   only: 'only this test case will be run',
//   a: 1,
//   e: 2
// },

{
  d: 'generate multiple results by using done()',
  a: 1,
  r: function(n){
    var done = this.async();
    done(null, n + 1, n + 2);
  },
  e: [null, 2, 3]
},

{
  d: 'handle multiple result by using `expect` of function type',
  a: 1,
  r: function(n){
    this.async()(n + 1, n + 2);
  },
  e: function(first, second){
    var expect = require('chai').expect;
    expect(first).to.equal(2);
    expect(second).to.equal(3);
  }
}
];


#### .describe(describe)

Specified the mocha's `describe` method. If you don't know how mocha works, leave this method alone.
 
#### .it(it)

Specified the mocha's `it` method. If you don't know how mocha works, leave this method alone.

## License

MIT
