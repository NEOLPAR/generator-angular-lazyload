'use strict';
var path = require('path');
var util = require('util');
var ScriptBase = require('../script-base.js');
var angularUtils = require('../util.js');


var Generator = module.exports = function Generator() {
  ScriptBase.apply(this, arguments);
  this.hookFor('angular-lazyload:controller');
  this.hookFor('angular-lazyload:view');
};

util.inherits(Generator, ScriptBase);

Generator.prototype.rewriteAppJs = function () {
  var config = {
    file: path.join(
      this.env.options.appPath,
      'scripts/app.js'),
    needle: '.otherwise',
    splicable: [
      "  templateUrl: '/views/" + this.name.toLowerCase() + ".html',",
      "  resolve: resolveController(['/scripts/controllers/" + this.name.toLowerCase() + ".js'])"
    ]
  };

  config.splicable.unshift(".when('/" + this.name + "', {");
  config.splicable.push("})");

  angularUtils.rewriteFile(config);
};
