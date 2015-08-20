
/*
 * Express default errors.
 */

var errors = {
  '404': 'Not Found',
  '401': 'Unauthorized',
  '500': 'Internal Server Error'
}

function defaultErrors () {
  return [handle404, catchAll]
}

/*
 * Creates a new error object for undefined routes.
 */

function handle404 (req, res, next) {
  var err = new Error()
  err.status = 404
  next(err)
}

/*
 * Handles all errors.
 */

function catchAll (err, req, res, next) {
  if (err.message === '') {
    var message = errors[String(err.status)]
    if (message !== undefined) {
      err.message = message
    } else {
      err.message = errors['500']
    }
  }

  res.status(err.status || 500)
  res.send({error: err.message})
}

/*
 * Module exports.
 */

module.exports = defaultErrors
