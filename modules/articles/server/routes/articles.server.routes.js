'use strict';

/**
 * Module dependencies
 */
var articlesPolicy = require('../policies/articles.server.policy'),
  articles = require('../controllers/articles.server.controller');

module.exports = function(app) {
  // Articles collection routes
  //app.route('/api/articles').all(articlesPolicy.isAllowed)
  app.route('/api/articles')
    .get(articles.list)
    .post(articles.create);

  // Single article routes
  app.route('/api/articles/:articleId')
    .get(articles.read)
    .put(articles.update)
    .delete(articles.delete);
};