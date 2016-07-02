(function() {
  'use strict';

  angular
    .module('studies')
    .controller('StudiesController', StudiesController);

  StudiesController.$inject = ['$http', '$scope', '$state', 'studyResolve', 'Authentication'];

  function StudiesController($http, $scope, $state, study, Authentication) {
    var vm = this;

    vm.study = study;
    vm.authentication = Authentication;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Study
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.study.$remove($state.go('studies.list'));
      }
    }

    // Save Study
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.studyForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.study.id) {
        vm.study.$update(successCallback, errorCallback);
      } else {
        vm.study.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('studies.view', {
          studyId: res.id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }

    }
  }
})();