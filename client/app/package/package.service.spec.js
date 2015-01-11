'use strict';

describe('Service: comparator', function () {

  // load the service's module
  beforeEach(module('npmpluginComperatorApp'));

  // instantiate service
  var comparator;
  beforeEach(inject(function (_comparator_) {
    comparator = _comparator_;
  }));

  it('should do something', function () {
    expect(!!comparator).toBe(true);
  });

});
