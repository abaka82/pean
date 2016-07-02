
'use strict';

var _ = require('lodash'),
  path = require('path'),
  config = require(path.resolve('./config/config')),
  db = require(path.resolve('./config/lib/sequelize')),
  express = require(path.resolve('./config/lib/express')),
  fs = require('fs-extra'),
  request = require('supertest'),
  should = require('should');

/**
 * Globals
 */
var agent, app;
var credentials, data, user, study;
var roleAdmin, roleUser;

/**
 * Study routes tests
 */
describe('Study "routes" Tests:', function() {
  before(function(done) {
    // Get application
    app = express.init(db.sequelize);
    agent = request.agent(app);

    // Get roles
    db.Role
      .findAll()
      .then(function(roles) {
        _.each(roles, function(value) {
          if (value.name === 'admin') {
            roleAdmin = value.id;
          } else if (value.name === 'user') {
            roleUser = value.id;
          }
        });
        done();
      })
      .catch(function(err) {
        return done(err);
      });
  });

  beforeEach(function(done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'sW1kXqrbyZUBNub6FKJgEA'
    };

    data = {
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    };

    // Build new user
    user =
      db.User
      .build(data);

    // Save 
    user
      .save()
      .then(function(user) {
        user.addRoles([roleUser, roleAdmin])
        .then(function(roles){
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

  it('should be able to save an study if logged in', function(done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function(signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          done(signinErr);
        }

        var userId = user.id;
        study = {
          title: 'Study Title',
          content: 'Study Content',
          userId: user.id
        };

        // Save a new study
        agent.post('/api/studies')
          .send(study)
          .expect(200)
          .end(function(studySaveErr, studySaveRes) {
            // Handle study save error
            if (studySaveErr) {
              done(studySaveErr);
            }
            // Get a list of studies
            agent.get('/api/studies')
              .end(function(studiesGetErr, studiesGetRes) {
                // Handle study save error
                if (studiesGetErr) {
                  done(studiesGetErr);
                }

                // Get studies list
                var studies = studiesGetRes.body;

                // Set assertions
                (studies[0].User.id).should.equal(userId);
                (studies[0].title).should.match('Study Title');

                agent
                  .get('/api/auth/signout')
                  .expect(302)
                  .end(function(err, res) {
                    if (err) {
                      return done(err);
                    }
                    res.redirect.should.equal(true);

                    // NodeJS v4 changed the status code representation so we must check
                    // before asserting, to be comptabile with all node versions.
                    if (process.version.indexOf('v4') === 0) {
                      res.text.should.equal('Found. Redirecting to /');
                    } else {
                      res.text.should.equal('Moved Temporarily. Redirecting to /');
                    }
                    done();
                  });
              });
          });
      });
  });

  it('should not be able to save an study if not logged in', function(done) {
    var mockStudy = {
      title: 'Study Title',
      content: 'Study Content',
    };
    request(app).post('/api/studies')
      .send(mockStudy)
      .expect(403)
      .end(function(studySaveErr, studySaveRes) {
        // Call the assertion callback
        if (studySaveErr) {
          done(studySaveErr);
        }
        done();
      });
  });

  it('should not be able to save an study if no title is provided', function(done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function(signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        var mockStudy = {
          content: 'Study content',
          userId: user.id
        };

        // Save a new study
        agent.post('/api/studies')
          .send(mockStudy)
          .expect(400)
          .end(function(studySaveErr, studySaveRes) {
            if (studySaveErr) {
              done(studySaveErr);
            }
            studySaveRes.body.message.should.equal('title cannot be null');

            agent
              .get('/api/auth/signout')
              .expect(302)
              .end(function(err, res) {
                if (err) {
                  return done(err);
                }
                res.redirect.should.equal(true);
                
                // NodeJS v4 changed the status code representation so we must check
                // before asserting, to be comptabile with all node versions.
                if (process.version.indexOf('v4') === 0) {
                  res.text.should.equal('Found. Redirecting to /');
                } else {
                  res.text.should.equal('Moved Temporarily. Redirecting to /');
                }
                done();
              });
          });
      });
  });

  it('should be able to update an study if signed in', function(done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function(signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          done(signinErr);
        }

        study = {
          title: 'Study Title',
          content: 'Study Content',
          userId: user.id
        };

        // Save a new study
        agent.post('/api/studies')
          .send(study)
          .expect(200)
          .end(function(studySaveErr, studySaveRes) {
            // Handle study save error
            if (studySaveErr) {
              done(studySaveErr);
            }

            // Update study title
            study = {
              title: 'New Study Title',
              content: 'Study Content',
              userId: user.id
            };

            // Update an existing study
            agent.put('/api/studies/' + studySaveRes.body.id)
              .send(study)
              .expect(200)
              .end(function(studyUpdateErr, studyUpdateRes) {
                // Handle study update error
                if (studyUpdateErr) {
                  done(studyUpdateErr);
                }

                // Set assertions
                (studyUpdateRes.body.id).should.equal(studySaveRes.body.id);
                (studyUpdateRes.body.title).should.match('New Study Title');
                agent
                  .get('/api/auth/signout')
                  .expect(302)
                  .end(function(err, res) {
                    if (err) {
                      return done(err);
                    }
                    res.redirect.should.equal(true);

                    // NodeJS v4 changed the status code representation so we must check
                    // before asserting, to be comptabile with all node versions.
                    if (process.version.indexOf('v4') === 0) {
                      res.text.should.equal('Found. Redirecting to /');
                    } else {
                      res.text.should.equal('Moved Temporarily. Redirecting to /');
                    }
                    // Call the assertion callback
                    done();
                  });
              });
          });
      });
  });

  it('should be able to get a list of studies if not signed in', function(done) {
    // Create new study model instance
    study = {
      title: 'Study Title',
      content: 'Study Content',
      userId: user.id
    };
    var studyObj = db.Study.build(study);

    // Save the study
    studyObj.save()
      .then(function() {
        // Request studies
        request(app).get('/api/studies')
          .end(function(req, res) {
            // Set assertion
            res.body.should.be.instanceof(Array).and.not.have.lengthOf(0);
            done();
          });
      })
      .catch(function(err) {
        should.not.exist(err);
      });
  });

  it('should be able to get a single study if not signed in', function(done) {
    study = {
      title: 'Study Title',
      content: 'Study Content',
      userId: user.id
    };

    // Create new study model instance
    var studyObj = db.Study.build(study);
    // Save the study
    studyObj.save()
      .then(function() {
        // Request studies
        request(app).get('/api/studies/' + studyObj.id)
          .end(function(req, res) {
            // Set assertion
            res.body.should.be.instanceof(Object).and.have.property('title', study.title);
            done();
          });
      })
      .catch(function(err) {
        should.not.exist(err);
      });
  });

  it('should return proper error for single study with an invalid Id, if not signed in', function(done) {
    // test is not a valid sequelize Id
    request(app).get('/api/studies/test')
      .end(function(req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', '');
        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single study which doesnt exist, if not signed in', function(done) {
    // This is a valid sequelize Id but a non-existent study
    request(app).get('/api/studies/559')
      .end(function(req, res) {
        // Set assertion
        should.equal(res.body,null);
        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an study if signed in', function(done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function(signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          console.log(signinErr.text);
          done(signinErr);
        }

        study = {
          title: 'Study Title',
          content: 'Study Content',
          userId: user.id
        };

        // Save a new study
        agent.post('/api/studies')
          .send(study)
          .expect(200)
          .end(function(studySaveErr, studySaveRes) {
            // Handle study save error
            if (studySaveErr) {
              done(studySaveErr);
            }
            
            // Delete an existing study
            agent.delete('/api/studies/' + studySaveRes.body.id)
              .send(study)
              .expect(200)
              .end(function(studyDeleteErr, studyDeleteRes) {
                // Handle study error error
                if (studyDeleteErr) {
                  done(studyDeleteErr);
                }

                // Set assertions
                (studyDeleteRes.body.id).should.equal(studySaveRes.body.id);

                agent
                  .get('/api/auth/signout')
                  .expect(302)
                  .end(function(err, res) {
                    if (err) {
                      return done(err);
                    }
                    res.redirect.should.equal(true);

                    // NodeJS v4 changed the status code representation so we must check
                    // before asserting, to be comptabile with all node versions.
                    if (process.version.indexOf('v4') === 0) {
                      res.text.should.equal('Found. Redirecting to /');
                    } else {
                      res.text.should.equal('Moved Temporarily. Redirecting to /');
                    }
                    // Call the assertion callback
                    done();
                  });
              });
          });
      });
  });

  it('should not be able to delete an study if not signed in', function(done) {
    study = {
      title: 'Study Title',
      content: 'Study Content',
      userId: user.id
    };

    // Create new study model instance
    var studyObj = db.Study.build(study);

    // Save the study
    studyObj.save()
      .then(function() {
        // Try deleting study
        request(app).delete('/api/studies/' + studyObj.id)
          .expect(403)
          .end(function(studyDeleteErr, studyDeleteRes) {
            // Set message assertion
            (studyDeleteRes.body.message).should.match('User is not authorized');

            // Handle study error error
            done(studyDeleteErr);
          });
      })
      .catch(function(err) {
        should.not.exist(err);
      });
  });

  it('should be able to get a single study that has an orphaned user reference', function(done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = db.User.build({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });
    _orphan.save()
      .then(function(orphan) {
        orphan.addRoles([roleUser, roleAdmin])
          .then(function(roles) {

            agent.post('/api/auth/signin')
              .send(_creds)
              .expect(200)
              .end(function(signinErr, signinRes) {
                // Handle signin error
                if (signinErr) {
                  done(signinErr);
                }

                // Get the userId
                var orphanId = orphan.id;
                study = {
                  title: 'Study title',
                  content: 'Study content',
                  userId: orphanId
                };

                // Save a new study
                agent.post('/api/studies')
                  .send(study)
                  .expect(200)
                  .end(function(studySaveErr, studySaveRes) {
                    // Handle study save error
                    if (studySaveErr) {
                      done(studySaveErr);
                    }
                    //console.log(studySaveRes.body);
                    // Set assertions on new study
                    (studySaveRes.body.title).should.equal(study.title);
                    //should.exist(studySaveRes.body.User);
                    should.equal(studySaveRes.body.userId, orphanId);
                    agent
                      .get('/api/auth/signout')
                      .expect(302)
                      .end(function(err, res) {
                        if (err) {
                          return done(err);
                        }
                        res.redirect.should.equal(true);

                        // NodeJS v4 changed the status code representation so we must check
                        // before asserting, to be comptabile with all node versions.
                        if (process.version.indexOf('v4') === 0) {
                          res.text.should.equal('Found. Redirecting to /');
                        } else {
                          res.text.should.equal('Moved Temporarily. Redirecting to /');
                        }
                        // force the study to have an orphaned user reference
                        orphan.destroy()
                          .then(function() {
                            // now signin with valid user
                            agent.post('/api/auth/signin')
                              .send(credentials)
                              .expect(200)
                              .end(function(err, res) {
                                // Handle signin error
                                if (err) {
                                  done(err);
                                }
                                // Get the study
                                agent.get('/api/studies/' + studySaveRes.body.id)
                                  .expect(200)
                                  .end(function(studyInfoErr, studyInfoRes) {
                                    // Handle study error
                                    if (studyInfoErr) {
                                      done(studyInfoErr);
                                    }

                                    // Set assertions
                                    (studyInfoRes.body.id).should.equal(studySaveRes.body.id);
                                    (studyInfoRes.body.title).should.equal(study.title);
                                    //should.equal(studyInfoRes.body.user, undefined);

                                    // Call the assertion callback
                                    done();
                                  });
                              });
                          })
                          .catch(function(err) {
                            should.not.exist(err);
                          });

                      });
                  });
              });
          })
          .catch(function(err) {
            should.not.exist(err);
          });
      })
      .catch(function(err) {
        should.not.exist(err);
      });
  });
  afterEach(function(done) {
    user
      .destroy()
      .then(function() {
        done();
      })
      .catch(function(err) {
        should.not.exist(err);
      });
  });
  after(function(done){
    db.Study.destroy({
      where: {
        title: 'Study Title'
      }
    })
    .then(function(){
      done();
    })
    .catch(function(err) {
      should.not.exist(err);
    });
  });
});
