# express-default-errors
Default ExpressJS error-handling middleware.

## Installation
	$ npm install express-default-errors

## Usage

`express-default-errors` provides simple middleware to catch default errors and serve custom errors.

```js
var express = require('express')
var errorHandler = require('express-default-errors')

var app = express()
var router = express.Router()

// Valid route that will not cause any errors
router.get('/', function (req, res, next) {
  res.status(200)
  res.send('success')
})

// To signify unauthorized access, simple create a new Error object with status = 401
router.get('/restricted-route', function (req, res, next) {
  var err = new Error()
  err.status = 401
  next(err)
})

// Custom error message
router.get('/error-route', function (req, res, next) {
  // Will default to err.status = 500 unless err.status is explicitly set
  var err = new Error('A custom error was caused.')
  next(err)
})

// This is not recommended, but you could also set non-standard status codes.
// The default error message will be 'Internal Server Error' unless set.
router.get('/invalid-status-code-error-route', function (req, res, next) {
  var err = new Error()
  err.status = 299
  next(err)
})

// Any errors will be sent with the appropriate status code by the response object as:
// {error: 'My error message here'}

// The error handler should be used after all routers
app.use(router)
app.use(errorHandler())

app.listen(3000)
```

## Default Errors

Setting the status code will cause the middleware to serve default error messages when calling `new Error()` without passing in any arguments, or if `err.message` is not set.

<table>
	<tr><th>Status Code</th><th>Default Message</th></tr>
  <tr><td>400</td><td><em>Bad Request</em></td></tr>
  <tr><td>401</td><td><em>Unauthorized</em></td></tr>
	<tr><td>404</td><td><em>Not Found</em></td></tr>
	<tr><td>500</td><td><em>Internal Server Error</em></td></tr>
</table>

## License
MIT
