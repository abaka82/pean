(function () {
  'use strict';

  angular
    .module('studies')
    .controller('StudiesListController', StudiesListController);

  StudiesListController.$inject = ['StudiesService'];

  function StudiesListController(StudiesService) {
    var vm = this;
    var studiesResult = [];
    //vm.expanded = false;

    StudiesService.query({}, function(data) {
      console.log('response: '+ data);
      angular.forEach(data, function(value, index){
        console.log('index: '+ index);
        console.log('value: '+ value);

         StudiesService.get({studyId: value}, function(data) {
             console.log('response detail: '+ JSON.stringify(data));
             data.expanded = false;
             studiesResult.push(data);
         });
      });
      vm.studies = studiesResult;
    });
  }
})();
