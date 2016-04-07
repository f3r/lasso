'use strict';
var nodePath = require('path');
require('chai').config.includeStack = true;
var marko = require('marko');
var lasso = require('../');
var rmdirRecursive = require('./util').rmdirRecursive;
var buildDir = nodePath.join(__dirname, 'build');
var fs = require('fs');

describe('lasso/taglib' , function() {
    require('./autotest').scanDir(
        nodePath.join(__dirname, 'fixtures/taglib-autotest'),
        function (dir, done) {
            var testName = nodePath.basename(dir);
            var pageName = 'taglib-' + testName;

            var mainPath = nodePath.join(dir, 'test.js');
            var main;

            if (fs.existsSync(mainPath)) {
                main = require(mainPath);
            } else {
                main = {};
            }

            var lassoConfig = main.getLassoConfig && main.getLassoConfig();
            if (!lassoConfig) {
                lassoConfig = {
                    bundlingEnabled: true,
                    fingerprintsEnabled: true
                };
            }

            if (!lassoConfig.outputDir) {
                lassoConfig.outputDir = nodePath.join(buildDir, pageName);
            }

            rmdirRecursive(lassoConfig.outputDir);

            var theLasso = lasso.create(lassoConfig, dir);

            // var main = require(nodePath.join(dir, 'test.js'));
            var templatePath = nodePath.join(dir, 'template.marko');
            var template = marko.load(templatePath);
            template.render({
                $global: {
                    lasso: theLasso
                },
                pageName: pageName
            }, function(err, html) {
                if (err) {
                    return done(err);
                }

                done(null, html);
            });
        }, {
            compareExt: '.marko'
        });

});