'use strict';

describe('Controller: ComparatorCtrl', function () {

  // load the controller's module
  beforeEach(module('npmpluginComperatorApp'));

  var ComparatorCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ComparatorCtrl = $controller('ComparatorCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
