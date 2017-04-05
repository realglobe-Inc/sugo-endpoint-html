/**
 * Test case for create.
 * Runs with mocha.
 */
'use strict'

const create = require('../lib/create.js')
const co = require('co')
const sgServer = require('sg-server')
const arequest = require('arequest')
const asleep = require('asleep')
const aport = require('aport')
const { ok, equal } = require('assert')

describe('create', () => {
  let server, baseUrl
  let request = arequest.create()
  before(() => co(function * () {
    let endpoint = create({
      account: {
        purchaseHistory: () => '<!DOCTYPE html><html><body>hoge</body></html>'
      }
    })
    ok(endpoint)
    let port = yield aport()
    server = sgServer({
      endpoints: {
        '/:module/:method': { GET: endpoint }
      }
    })
    baseUrl = `http://localhost:${port}`
    yield server.listen(port)
  }))

  after(() => co(function * () {
    yield asleep(10)
    yield server.close()
  }))

  it('Send a request', () => co(function * () {
    let { body, statusCode, headers } = yield request({
      method: 'GET',
      url: `${baseUrl}/account/purchase-history`
    })
    ok(body)
    equal(headers[ 'content-type' ], 'text/html; charset=utf-8')
    equal(statusCode, 200)
    equal(body, '<!DOCTYPE html><html><body>hoge</body></html>')
  }))
})

/* global describe, before, after, it */
