'use strict';

describe('Controller: PluginCtrl', function () {

  // load the controller's module
  beforeEach(module('npmpluginComperatorApp'));

  var PluginCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PluginCtrl = $controller('PluginCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
