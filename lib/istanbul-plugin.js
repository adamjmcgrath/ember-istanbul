var istanbul = require('istanbul');
var stew = require('broccoli-stew');
var fs = require('fs');

function IstanbulPlugin(appName) {
  this.name = 'ember-istanbul';
  this.appName = appName;
}

IstanbulPlugin.prototype.toTree = function(tree, inputPath, outputPath, inputOptions) {
	var instrumenter = new istanbul.Instrumenter({
		noAutoWrap: true,
		es6Modules: true
	});
  var appName = this.appName;
	return stew.log(stew.map(tree, '**/*.js', function(data, filePath) {
    // Fix addon path
    filePath = filePath.replace(new RegExp('^modules\/' + appName), 'addon');
    // Fix app path.
    filePath = filePath.replace(new RegExp('^' + appName), 'app');
    // Don't instrument addons, tests and merged app tree files.
    if (!fs.existsSync(filePath)) {
      return data;
    }

		return instrumenter.instrumentSync(data, filePath);
	}));
};

module.exports = IstanbulPlugin;
