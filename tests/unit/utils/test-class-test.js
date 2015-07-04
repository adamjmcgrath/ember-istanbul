import TestClass from '../../../utils/test-class';
import { module, test } from 'qunit';

module('Unit | Utility | test class');

test('it adds stuff together', function(assert) {
  var instance = new TestClass();
  assert.ok(instance.testedMethod(1, 2) === 3);
});
