'use strict';

describe('Controller: PackageCtrl', function () {

  // load the controller's module
  beforeEach(module('NodePackageComperatorApp'));

  var PackageCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PackageCtrl = $controller('PackageCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
