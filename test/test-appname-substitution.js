/*global describe, before, it, beforeEach */
'use strict';
var fs = require('fs');
var assert = require('assert');
var path = require('path');
var util = require('util');
var generators = require('yeoman-generator');
var helpers = require('yeoman-generator').test;


describe('Angular-Lazyload generator template mechanism', function () {
    //TODO: Add underscore dependency and test with _.camelize(folderName);
    var folderName = 'UpperCaseBug';
    var angular;

    beforeEach(function (done) {
        var deps = [
            '../../app',
            '../../common',
            '../../controller',
            '../../main', [
                helpers.createDummyGenerator(),
                'karma-require:app'
            ]
        ];
        helpers.testDirectory(path.join(__dirname, folderName), function (err) {
            if (err) {
                done(err);
            }
            angular = helpers.createGenerator('angular-lazyload:app', deps);
            angular.options['skip-install'] = true;
            done();
        });
    });

    it('should generate the same appName in every file', function (done) {
        var expectedAppName = 'upperCaseBugApp';
        var expected = [
            'app/scripts/app.js',
            'app/scripts/controllers/main.js',
            'app/index.html',
            'test/spec/controllers/mainSpec.js'
        ];
        helpers.mockPrompt(angular, {
          compass: true,
          bootstrap: true,
          compassBootstrap: true,
          modules: []
        });

        angular.run({}, function () {
            // Check if all files are created for the test
            helpers.assertFiles(expected);

            // read JS Files
            var app_js = fs.readFileSync('app/scripts/app.js', 'utf8');
            var main_js = fs.readFileSync('app/scripts/controllers/main.js', 'utf8');

            // Test JS Files
            var regex_js_app = new RegExp('module\\(\'' + expectedAppName + '\'');
            assert.ok(regex_js_app.test(app_js), 'app.js template using a wrong appName');

            // read HTML file
            var index_html = fs.readFileSync('app/index.html', 'utf8');

            // Test HTML File
            var regex_html = new RegExp('ng-app=\"' + expectedAppName + '\"');
            assert.ok(regex_html.test(index_html), 'index.html template using a wrong appName');
            done();
        });
    });
});
