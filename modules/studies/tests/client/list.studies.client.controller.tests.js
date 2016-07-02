(function () {
  'use strict';

  describe('Studies List Controller Tests', function () {
    // Initialize global variables
    var StudiesListController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      StudiesService,
      mockStudy;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _StudiesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      StudiesService = _StudiesService_;

      // create mock study
      mockStudy = new StudiesService({
        id: '1234',
        title: 'An Study about PEAN',
        content: 'PEAN is great!',
        userId: '1'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Studies List controller.
      StudiesListController = $controller('StudiesListController as vm', {
        $scope: $scope
      });

      //Spy on state go
      spyOn($state, 'go');
    }));

    describe('Instantiate', function () {
      var mockStudyList;

      beforeEach(function () {
        mockStudyList = [mockStudy, mockStudy];
      });

      it('should send a GET request and return all studies', inject(function (StudiesService) {
        // Set POST response
        $httpBackend.expectGET('api/studies').respond(mockStudyList);


        $httpBackend.flush();

        // Test form inputs are reset
        expect($scope.vm.studies.length).toEqual(2);
        expect($scope.vm.studies[0]).toEqual(mockStudy);
        expect($scope.vm.studies[1]).toEqual(mockStudy);

      }));
    });
  });
})();
