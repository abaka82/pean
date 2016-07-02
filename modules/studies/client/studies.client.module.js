(function (app) {
  'use strict';

  app.registerModule('studies');
  app.registerModule('studies.services');
  app.registerModule('studies.routes', ['ui.router', 'studies.services']);
})(ApplicationConfiguration);
