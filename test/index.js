
/* global describe it */

/*
 * Module dependencies.
 */

var express = require('express')
var request = require('request')
var should = require('should')

var errorHandler = require('../lib')

describe('express-default-errors', function () {

  var port = 9999

  /*
   * Setup test server.
   */

  function setupTestServer () {
    var app = express()

    var router = express.Router()

    router.get('/', function (req, res, next) {
      res.status(200)
      res.send('success')
    })

    router.get('/restricted-route', function (req, res, next) {
      var err = new Error('Restricted route.')
      err.status = 401
      next(err)
    })

    router.get('/bad-request-route', function (req, res, next) {
      var err = new Error()
      err.status = 400
      next(err)
    })

    router.get('/error-route', function (req, res, next) {
      var err = new Error('A custom error was caused.')
      next(err)
    })

    router.get('/invalid-status-code-error-route', function (req, res, next) {
      var err = new Error()
      err.status = 299
      next(err)
    })

    app.use(router)
    app.use(errorHandler())

    return app.listen(port)
  }

  /*
   * Tests.
   */

  it('should result in a 200 status code', function (done) {
    var server = setupTestServer()
    var url = 'http://localhost:' + port + '/'

    request(url, function (err, response, body) {
      should.not.exist(err)
      should.exist(response)
      should.exist(response.statusCode)
      response.statusCode.should.eql(200)
      server.close()
      done()
    })
  })

  it('should result in a 404 status code', function (done) {
    var server = setupTestServer()
    var url = 'http://localhost:' + port + '/nonexistant-route'

    request(url, function (err, response, body) {
      should.not.exist(err)
      should.exist(response)
      should.exist(response.statusCode)
      JSON.parse(body).error.should.eql('Not Found')
      response.statusCode.should.eql(404)
      server.close()
      done()
    })
  })

  it('should result in a 401 status code', function (done) {
    var server = setupTestServer()
    var url = 'http://localhost:' + port + '/restricted-route'

    request(url, function (err, response, body) {
      should.not.exist(err)
      should.exist(response)
      should.exist(response.statusCode)
      response.statusCode.should.eql(401)
      server.close()
      done()
    })
  })

  it('should result in a 500 status code', function (done) {
    var server = setupTestServer()
    var url = 'http://localhost:' + port + '/error-route'

    request(url, function (err, response, body) {
      should.not.exist(err)
      should.exist(response)
      should.exist(response.statusCode)
      JSON.parse(body).error.should.eql('A custom error was caused.')
      response.statusCode.should.eql(500)
      server.close()
      done()
    })
  })

  it('should result in a 299 status code', function (done) {
    var server = setupTestServer()
    var url = 'http://localhost:' + port + '/invalid-status-code-error-route'

    request(url, function (err, response, body) {
      should.not.exist(err)
      should.exist(response)
      should.exist(response.statusCode)
      JSON.parse(body).error.should.eql('Internal Server Error')
      response.statusCode.should.eql(299)
      server.close()
      done()
    })
  })

  it('should result in a 400 status code', function (done) {
    var server = setupTestServer()
    var url = 'http://localhost:' + port + '/bad-request-route'

    request(url, function (err, response, body) {
      should.not.exist(err)
      should.exist(response)
      should.exist(response.statusCode)
      JSON.parse(body).error.should.eql('Bad Request')
      response.statusCode.should.eql(400)
      server.close()
      done()
    })
  })
})
