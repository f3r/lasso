var expect = require('chai').expect;
var fs = require('fs');

exports.getLassoConfig = function(dir) {
    return {
        bundlingEnabled: false,
        fingerprintsEnabled: false,
        plugins: [
            function myPlugin(lasso, pluginConfig) {
                lasso.dependencies.registerRequireType(
                    'foo',
                    {
                        properties: {
                            'path': 'string'
                        },

                        async init (lassoContext) {
                            if (!this.path) {
                                throw new Error('"path" is required for a Marko dependency');
                            }

                            this.path = this.resolvePath(this.path);
                        },

                        read (lassoContext) {
                            var src = fs.readFileSync(this.path, { encoding: 'utf8' });
                            return 'exports.FOO = ' + JSON.stringify(src) + '; exports.filename = __filename;';
                        }
                    });
            }
        ]
    };
};

exports.getLassoOptions = function(dir) {
    return {
        dependencies: [
            'require-run: ./main',
            "./hello.foo"
        ]
    };
};

exports.check = function(window) {
    expect(window.main.filename).to.contain('main');

    expect(window.main.hello.FOO).to.equal('hello');
    expect(window.main.hello.filename).to.contain('hello.foo');

    expect(window.main.world.FOO).to.equal('world');
    expect(window.main.world.filename).to.contain('world.foo');
};
