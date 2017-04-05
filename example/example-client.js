/** This is example of client */

'use strict'

const arequest = require('arequest')

async function tryExampleClient () {
  let request = arequest.create()
  let { body, statusCode } = yield request({
    method: 'GET',
    // Specify the module and method as url with hyphen-case name
    url: `http://localhost/account/profile`,
  })
  // Return values as response body
  console.log(body) // -> <!DOCTYPE html><html><!-- ... --></html>
}

tryExampleClient().catch((err) => console.error(err))
