/** This is an example to use sugo-endpoint-html */

'use strict'

const sgServer = require('sg-server')

const sugoEndpointHTML = require('sugo-endoint-html')

const renders = {
  account: {
    profile: () => {
      // Returns html string to render
      return '<!DOCTYPE html><html><!- ... -></html>'
    },
    purchaseHistory: () => {
      return '<!DOCTYPE html><html><!- ... -></html>'
    }
  }
}

const server = sgServer({
  middlewares: [
    /* ... */
  ],
  endpoints: {
    // Exports actor module functions as http endpoint (like "/account/purchase-history")
    '/:module/:method': { GET: sugoEndpointHTML(renders) }
  }
})

server.listen(3000)

