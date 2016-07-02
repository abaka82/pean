(function () {
  'use strict';

  angular
    .module('studies')
    .controller('StudiesListController', StudiesListController);

  StudiesListController.$inject = ['StudiesService'];

  function StudiesListController(StudiesService) {
    var vm = this;

    vm.studies = StudiesService.query();
  }
})();
