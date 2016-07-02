'use strict';

describe('Studies E2E Tests:', function () {
  describe('Test studies page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/studies');
      expect(element.all(by.repeater('study in studies')).count()).toEqual(0);
    });
  });
});
