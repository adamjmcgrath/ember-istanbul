/* jshint node: true */
'use strict';

var IstanbulPlugin = require('./lib/istanbul-plugin');
var bodyParser = require('body-parser');
var coverageMiddleware = require('./lib/coverage-middleware');
var funnel = require('broccoli-funnel');
var path = require('path');

function logErrors(err, req, res, next) {
  console.error(err.stack);
  next(err);
}

module.exports = {
  name: 'ember-istanbul',

  validEnv: function(config) {
    return config.app.env !== 'production' && config.app.env !== 'staging';
  },

  middleware: function(app, options) {
    console.log('Middleware', app.name);
    app.post('/write-istanbul-coverage',
             bodyParser.json(),
             coverageMiddleware(options),
             logErrors);
  },

  serverMiddleware: function(config) {
    console.log('serverMiddleware');
    //if(!this.validEnv(config)) { return; }
    this.middleware(config.app, config.options);
  },

  testemMiddleware: function(config) {
    console.log('testemMiddleware');
    //if(!this.validEnv(config)) { return; }
    this.middleware(config.app, {});
  },

  setupPreprocessorRegistry: function(type, registry) {
    registry.add('js', new IstanbulPlugin(this.parent.pkg.name));
  },

  treeForPublic: function() {
    var testemPath = path.join(__dirname, 'node_modules/testem/public/testem');
    return funnel(testemPath, {
      files: ['testem_client.js', 'qunit_adapter.js']
    })
  },

  contentFor: function(type) {
  	if (type === 'test-body-footer') {
      return '<script src="qunit_adapter.js"></script>\n' +
  		'<script src="testem_client.js"></script>\n' +
      '<script>\n' +
  		  'Testem.on("all-test-results", function(results){\n' +
        ' $.ajax({\n' +
        '   type: "POST",\n' +
        '   url: "/write-istanbul-coverage",\n' +
        '   datatype: "json",\n' +
        '   contentType: "application/json; charset=utf-8",\n' +
        '   data: JSON.stringify(window.__coverage__)\n' +
        ' });\n' +
        '});\n' +
      '</script>';
  	}
  	return '';
  }
};
