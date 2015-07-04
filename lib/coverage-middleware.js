var istanbul = require('istanbul');
var collector = new istanbul.Collector();
var reporter = new istanbul.Reporter();

module.exports = function(options) {

  var sync = false;
  reporter.addAll([ 'lcov', 'text' ]);

  return function(req, res) {
    collector.add(req.body);
    reporter.write(collector, sync, function () {
      console.log('All reports generated');
    });
    res.status(200).send('done');
  };
};
