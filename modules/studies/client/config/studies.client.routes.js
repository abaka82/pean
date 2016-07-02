(function() {
  'use strict';

  angular
    .module('studies.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('studies', {
        abstract: true,
        url: '/studies',
        template: '<ui-view/>'
      })
      .state('studies.list', {
        url: '',
        templateUrl: 'modules/studies/client/views/list-studies.client.view.html',
        controller: 'StudiesListController',
        controllerAs: 'vm'
      })
      .state('studies.create', {
        url: '/create',
        templateUrl: 'modules/studies/client/views/form-study.client.view.html',
        controller: 'StudiesController',
        controllerAs: 'vm',
        resolve: {
          studyResolve: newStudy
        },
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('studies.edit', {
        url: '/:studyId/edit',
        templateUrl: 'modules/studies/client/views/form-study.client.view.html',
        controller: 'StudiesController',
        controllerAs: 'vm',
        resolve: {
          studyResolve: getStudy
        },
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('studies.view', {
        url: '/:studyId',
        templateUrl: 'modules/studies/client/views/view-study.client.view.html',
        controller: 'StudiesController',
        controllerAs: 'vm',
        resolve: {
          studyResolve: getStudy
        }
      });
  }

  getStudy.$inject = ['$stateParams', 'StudiesService'];

  function getStudy($stateParams, StudiesService) {
    return StudiesService.get({
      studyId: $stateParams.studyId
    }).$promise;
  }

  newStudy.$inject = ['StudiesService'];

  function newStudy(StudiesService) {
    return new StudiesService();
  }
})();