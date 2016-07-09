(function () {
  'use strict';

  angular
    .module('studies')
    .controller('StudiesListController', StudiesListController);

  StudiesListController.$inject = ['StudiesService'];

  function StudiesListController(StudiesService) {
    var vm = this;
    var studiesResult = [];

    StudiesService.query({}, function(data) {
      angular.forEach(data, function(value, index) {
        StudiesService.get({ studyId: value }, function(data) {
          data.expanded = false;
          studiesResult.push(data);
        });
      });
      vm.studies = studiesResult;
    });
  }
})();
