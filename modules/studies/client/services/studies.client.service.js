(function() {
  'use strict';

  angular
    .module('studies.services')
    .factory('StudiesService', StudiesService);

  StudiesService.$inject = ['$resource'];

  function StudiesService($resource) {
    return $resource('https://orthanc.chu.ulg.ac.be/demo/studies/:studyId', {
      studyId: '@id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();