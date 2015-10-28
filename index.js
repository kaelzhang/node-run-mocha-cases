'use strict';

module.exports = run;
run.Run = Run;

var util = require('util');

var wrap = require('wrap-as-async');
var mix = require('mix2');
var make_array = require('make-array');

var case_ = require('./lib/case');


if (!util.isFunction) {
  util.isFunction = function (fn) {
    return typeof fn === 'function';
  }
}


function run (description, runner) {
  if (util.isFunction(description)) {
    runner = description;
    description = null;
  }

  var r = new Run();
  description && r.description(description);
  runner && r.runner(runner);
  return r;
}


function Run () {}


Run.prototype.description = function(description) {
  this._description = description;
  return this;
};

Run.prototype._get_description = function() {
  return this._description; 
};


Run.prototype.describe = function (describe) {
  this._describe = describe;
  return this;
};

Run.prototype._get_describe = function() {
  return this._describe || global.describe;
};


Run.prototype.it = function (it) {
  this._it = it;
  return this;
};

Run.prototype._get_it = function(c) {
  var it = this._it || global.it;
  return c.only
    ? it.only
    : it;
};


Run.prototype.runner = function (runner) {
  this._runner = runner;
  return this;
};

Run.prototype._get_runner = function(c) {
  return this._runner || c.runner || c.r;
};


Run.prototype.start = function (cases) {
  function run_case (c) {
    this._get_it(c)(case_.title(c), function (done) {
      var args = case_.args(c);
      var runner = this._get_runner(c);

      if (!runner) {
        throw new Error(
          'No runner found. '
          + 'It could be defined by `run.runner(runner)` or `{runner: runner}` in cases.'
        );
      }

      // If the runner only has more than one parameter,
      // the `c.args` will be treated as arguments instead of the first argument
      if (runner.length === 1) {
        args = [args];
      } else {
        args = make_array(args);
      }

      var wrapped = wrap(runner);
      var exp = case_.expect(c);

      function callback () {
        done();
        var args = make_array(arguments);
        var arg_length = arguments.length;
        
        if (!is_async) {
          // if is an sync method, the last argument is the real value,
          // see `wrap-as-async`
          args = [args.pop()]
        
        // If there is only one parameters in `done`
        } else if (args === 1) {
          exp = [exp];

        // If the length of expect values is less than arg_length,
        // we only test the values inside `exp`
        } else {
          exp = make_array(exp);
        }

        if (util.isFunction(exp)) {
          exp.apply(null, args);
          return;
        }

        if (util.isArray(exp)) {
          exp.forEach(function (exp, i) {
            case_.equal(args[i], exp);
          });
        }
      }

      args.push(callback);

      var is_async;
      try {
        is_async = wrapped.apply(null, args);
      } catch(e) {
        var error = case_.error(c);
        if (!error) {
          throw e;
        }
        done();
      }

    }.bind(this));
  }

  var description = this._get_description();
  if (!description) {
    return cases.forEach(run_case, this);
  }

  this._get_describe()(description, function(){
    cases.forEach(run_case, this);
  }.bind(this));
};


var instance = new run.Run();

// So, user can use `run.go()` directly
mix(run, instance);
