'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  db = require(path.resolve('./config/lib/sequelize')),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a study
 */
exports.create = function(req, res) {
  // console.log('* studies.server.controller - create *');

  // save and return and instance of study on the res object. 
  db.Study.create({
    title: req.body.title,
    content: req.body.content,
    userId: req.user.id
  })
  .then(function(newStudy) {
    return res.json(newStudy);
  })
  .catch(function(err) {
    return res.status(400).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

/**
 * Delete an study
 */
exports.delete = function(req, res) {
  // console.log('* studies.server.controller - delete *');

  var id = req.params.studyId;

  db.Study
    .findOne({
      where: {
        id: id
      },
      include: [
        db.User
      ]
    })
    .then(function(study) {
      study.destroy()
        .then(function() {
          return res.json(study);
        })
        .catch(function(err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        });

      return null;
    })
    .catch(function(err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    });
};

/**
 * List of Studies
 */
exports.list = function(req, res) {
  // console.log('* studies.server.controller - list *');

  db.Study.findAll({
    include: [
      db.User
    ]
  })
  .then(function(studies) {
    return res.json(studies);
  })
  .catch(function(err) {
    return res.status(400).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

/**
 * Show the current study
 */
exports.read = function(req, res) {
  // console.log('* studies.server.controller - read *');

  var id = req.params.studyId;

  db.Study.find({
    where: {
      id: id
    },
    include: [
      db.User
    ]
  })
  .then(function(study) {
    return res.json(study);
  })
  .catch(function(err) {
    return res.status(400).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

/**
 * Update a study
 */
exports.update = function(req, res) {
  // console.log('* studies.server.controller - update *');

  var id = req.params.studyId;

  db.Study
    .findOne({
      where: {
        id: id
      },
      include: [
        db.User
      ]
    })
    .then(function(study) {
      study.updateAttributes({
        title: req.body.title,
        content: req.body.content
      })
      .then(function() {
        return res.json(study);
      })
      .catch(function(err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      });

      return null;
    })
    .catch(function(err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    });
};
