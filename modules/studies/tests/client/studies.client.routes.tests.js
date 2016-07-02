(function () {
  'use strict';

  describe('Studies Route Tests', function () {
    // Initialize global variables
    var $scope,
      StudiesService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _StudiesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      StudiesService = _StudiesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('studies');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/studies');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          StudiesController,
          mockStudy;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('studies.view');
          $templateCache.put('modules/studies/client/views/view-study.client.view.html', '');

          // create mock study
          mockStudy = new StudiesService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Study about PEAN',
            content: 'PEAN is great!',
            userId: '1'
          });

          //Initialize Controller
          StudiesController = $controller('StudiesController as vm', {
            $scope: $scope,
            studyResolve: mockStudy
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:studyId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.studyResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            studyId: 1
          })).toEqual('/studies/1');
        }));

        it('should attach an study to the controller scope', function () {
          expect($scope.vm.study.id).toBe(mockStudy.id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/studies/client/views/view-study.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          StudiesController,
          mockStudy;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('studies.create');
          $templateCache.put('modules/studies/client/views/form-study.client.view.html', '');

          // create mock study
          mockStudy = new StudiesService();

          //Initialize Controller
          StudiesController = $controller('StudiesController as vm', {
            $scope: $scope,
            studyResolve: mockStudy
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.studyResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/studies/create');
        }));

        it('should attach an study to the controller scope', function () {
          expect($scope.vm.study.id).toBe(mockStudy.id);
          expect($scope.vm.study.id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/studies/client/views/form-study.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          StudiesController,
          mockStudy;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('studies.edit');
          $templateCache.put('modules/studies/client/views/form-study.client.view.html', '');

          // create mock study
          mockStudy = new StudiesService({
            id: '1234',
            title: 'An Study about PEAN',
            content: 'PEAN is great!',
            userId: '1'
          });

          //Initialize Controller
          StudiesController = $controller('StudiesController as vm', {
            $scope: $scope,
            studyResolve: mockStudy
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:studyId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.studyResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            studyId: 1
          })).toEqual('/studies/1/edit');
        }));

        it('should attach an study to the controller scope', function () {
          expect($scope.vm.study.id).toBe(mockStudy.id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/studies/client/views/form-study.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
