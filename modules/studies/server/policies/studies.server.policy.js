'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Studies Permissions
 */
exports.invokeRolesPolicies = function() {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/studies',
      permissions: '*'
    }, {
      resources: '/api/studies/:studyId',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/studies',
      permissions: ['get', 'post']
    }, {
      resources: '/api/studies/:studyId',
      permissions: '*'
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/studies',
      permissions: ['get']
    }, {
      resources: '/api/studies/:studyId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Studies Policy Allows
 */
exports.isAllowed = function(req, res, next) {
  var roles = (req.user) ? req.user.dataValues.roles : ['guest'];
  // If an study is being processed and the current user created it then allow any manipulation
  if (req.study && req.user && req.study.User && req.study.User.id === req.user.id) {
    return next();
  }

  // Check for user roles
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function(err, isAllowed) {
    if (err) {
      // An authorization error occurred
      return res.status(500).send('Unexpected authorization error');
    } else {
      if (isAllowed) {
        // Access granted! Invoke next middleware
        return next();
      } else {
        return res.status(403).json({
          message: 'User is not authorized'
        });
      }
    }
  });
};