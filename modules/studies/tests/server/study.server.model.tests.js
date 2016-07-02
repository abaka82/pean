'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
  should = require('should'),
  path = require('path'),
  db = require(path.resolve('./config/lib/sequelize'));

/**
 * Globals
 */
var user, study;
var roleAdmin, roleUser; 

/**
 * Unit tests
 */
describe('Study "model" Tests:', function () {

  before(function(done) {
    user =
      db.User
      .build({
        firstName: 'Full',
        lastName: 'Name',
        displayName: 'Full Name',
        email: 'test@test.com',
        username: 'username',
        password: 'M3@n.jsI$Aw3$0m3',
        provider: 'local'
      });
      // Get roles
    db.Role
      .findAll ()
      .then(function(roles) {
        
        _.each(roles, function(value) {
          if (value.name === 'admin') {
            roleAdmin = value.id;
          } else if (value.name === 'user') {
            roleUser = value.id;
          }
        });
      })
      .catch(function(err) {
        return done(err);
      });

    user.save()
    .then(function(user){
      user.addRoles([roleUser, roleAdmin])
        .then(function(roles) {
          //console.log(user.dataValues.id);
          study = db.Study
          .build({
            title: 'Study Title',
            content: 'Study Content',
            userId: user.dataValues.id
          });
          done();
        })
        .catch(function(err) {
          return done(err);
        });
    })
    .catch(function(err) {
      return done(err);
    });
  });
  
  it('should be able to save without problems', function(done) {
    study.save()
      .then(function(study) {
        should.exist(study);
        done();
      })
      .catch(function(err) {
        should.not.exist(err);
      });
  });

  it('should be able to show an error when try to save without title', function(done) {
    study.title = '';
    study.save()
      .then(function(study) {
        should.not.exist(study);
      })
      .catch(function(err) {
        should.exist(err);
        done();
      });
  });

  it('should be able to update an study ', function(done) {
    db.Study
      .findOne({
        where: {
          id: 1
        },
        include: [
          db.User
        ]
      })
      .then(function(study) {
        study.updateAttributes({
          title: 'Study Title Updated',
          content: 'Study Content Updated'
        })
          .then(function() {
            done();
          })
          .catch(function(err) {
            should.not.exist(err);
          });
      })
      .catch(function(err) {
        done();
      });
  });


  it('should be able to delete an study ', function(done) {
    db.Study
      .findOne({
        where: {
          id: 1
        },
        include: [
          db.User
        ]
      })
      .then(function(study) {
        study.destroy()
          .then(function() {
            done();
          })
          .catch(function(err) {
            should.not.exist(err);
          });
      })
      .catch(function(err) {
        done();
      });
  });

  it('should be able to show the list of studys', function(done) {

    var limit = 10;
    var offset = 0;

    db.Study
      .findAll({
        where: {
          id: 1
        },
        include: [
          db.User
        ],
        'limit': limit,
        'offset': offset,
        'order': [
          ['createdAt', 'DESC']
        ]
      })
      .then(function(studys) {
        done();
      })
      .catch(function(err) {
        should.not.exist(err);
      });
  });

  after(function(done) {
    user
      .destroy()
      .then(function() {
        study
          .destroy()
          .then(function() {
            done();
          })
          .catch(function(err) {
            should.not.exist(err);
          });
      })
      .catch(function(err) {
        should.not.exist(err);
      });
  });
});
