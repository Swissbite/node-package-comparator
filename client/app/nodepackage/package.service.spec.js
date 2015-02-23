'use strict';

describe('Service: comparator', function () {

  // load the service's module
  beforeEach(module('NodePackageComperatorApp'));

  // instantiate service
  var NodePackage;
  beforeEach(inject(function (_NodePackage_) {
    NodePackage = _NodePackage_;
  }));

  it('should do something', function () {
    expect(!!NodePackage).toBe(true);
  });

});
