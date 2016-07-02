'use strict';

/**
 * Module dependencies
 */
var studiesPolicy = require('../policies/studies.server.policy'),
  studies = require('../controllers/studies.server.controller');

module.exports = function(app) {
  // Studies collection routes
  //app.route('/api/studies').all(studiesPolicy.isAllowed)
  app.route('/api/studies')
    .get(studies.list)
    .post(studies.create);

  // Single article routes
  app.route('/api/studies/:articleId')
    .get(studies.read)
    .put(studies.update)
    .delete(studies.delete);
};