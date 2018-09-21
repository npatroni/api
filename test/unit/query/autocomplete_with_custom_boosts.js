const proxyquire = require('proxyquire');

module.exports.tests = {};

module.exports.tests.query = function(test, common) {
  test('valid autocomplete with custom boosts', function(t) {
    const clean = {
      tokens: ['foo'],
      tokens_complete: ['foo'],
      tokens_incomplete: [],
      text: 'test',
      querySize: 10
    };

    const config_with_boosts = {
      generate: function() {
        return {
          api: {
            customBoosts: {
              source: {
                openstreetmap: 5
              },
              layer: {
                transit: 3
              }
            }
          }
        };
      }
    };

    var expected_query = require('../fixture/autocomplete_custom_boosts.json');

    const autocomplete_query_module = proxyquire('../../../query/autocomplete', {
      'pelias-config': config_with_boosts
    });

    const actual_query = JSON.parse( JSON.stringify( autocomplete_query_module(clean) ) );

    t.deepEqual(actual_query, expected_query, 'query as expected');
    t.pass();
    t.end();
  });
};

module.exports.all = function (tape, common) {
  function test(name, testFunction) {
    return tape('autocomplete with custom boosts query ' + name, testFunction);
  }

  for( var testCase in module.exports.tests ){
    module.exports.tests[testCase](test, common);
  }
};
