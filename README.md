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
run(runner).start(cases);

// Default runner which could be override by `case.runner`.
function runner (n){
  if (n < 0) {
    throw new Error('n should not less than 0');
  }
  return n + 1;
}
```

### The `cases`

We could write test cases in a neet and handy way. 

```js
var cases = [

  // The first test case is equivalent to:
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
    // Short cut for `description`
    d: 'shortcut',
    // Shortcut for `args`
    a: 1,
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
    runner: function(n){
      // Uses the common `this.async()` style to 
      // turn the runner into an asynchronous method.

      // ATTENSION! `this.async()` should be called outside the `setTimeout`.
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
    // If there is 3(more than one_ parameter passed to `done`,
    // the `case.e` will be treated as three result.
    e: [null, 2, 3]
  },

  {
    d: 'multiple arguments to be passed into runner',
    a: [1, 2],
    // If the runner has 2(more than one) arguments, 
    // the `case.args` will be passed as 2 parameters instead of an array.
    r: function(n, m){
      return n + m;
    },
    e: 3
  },

  {
    d: 'handle multiple results by using `expect` of function type',
    a: 1,
    r: function(n){
      var done = this.async();
      done(null, n + 1, n + 2);
    },
    e: function(err, first, second){
      var expect = require('chai').expect;
      expect(err).to.equal(null);
      expect(first).to.equal(2);
      expect(second).to.equal(3);
    }
  }
];
```


## run([description] [, runner])
## run().description(description).run(runner)
## run.description(description).run(runner)
## run(description).runner(runner)

Creates a runner by the specific `description` and the default `runner` function.

- description `string=` (optional) defines the mocha description for the `describe` method. If not set `run-mocha-cases` will give you one.
- runner `function()=` (optional) defines the default runner function. It can be overridden by `cases[i].runner`. If each case has a runner function, you `start(cases)` with the default `runner` being unset. 

##### The simplest situation:

```js
run.start(cases);
```

##### Some other usages:

```js
run(runner).start(cases);

```

#### .start(cases)

Runs all test cases.

- cases `Array.<Object>` The test cases to be run.

#### .describe(describe)

Specified the mocha's `describe` method. If you don't know how mocha works, leave this method alone.
 
Returns `this`.

#### .it(it)

Specified the mocha's `it` method. If you don't know how mocha works, leave this method alone.

Returns `this`.

## License

MIT
