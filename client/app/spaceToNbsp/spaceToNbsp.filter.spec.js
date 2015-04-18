'use strict';

describe('Filter: spaceToNbsp', function () {

  // load the filter's module
  beforeEach(module('NodePackageComparator'));

  // initialize a new instance of the filter before each test
  var spaceToNbsp;
  beforeEach(inject(function ($filter) {
    spaceToNbsp = $filter('spaceToNbsp');
  }));

  it('should return the input prefixed with "spaceToNbsp filter:"', function () {
    var text = 'angularjs';
    expect(spaceToNbsp(text)).toBe('spaceToNbsp filter: ' + text);
  });

});
