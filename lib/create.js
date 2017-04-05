/**
 * Sugo endpoint to server dynamic HTML
 * @function sugoEndpointHtml
 * @param {Object<string, Object<string, function>>} renderers - Renderer functions
 * @param {object} [options] - Optional settings.
 * @returns {function} - Defined app function.
 */

'use strict'

const co = require('co')
const debug = require('debug')('sugo:endpoint:html')
const { camelcase } = require('stringcase')

const notFoundError = (ctx, message) => {
  ctx.status = 404
  ctx.body = message
}

/** @lends sugoEndpointHtml */
function create (renderers, options = {}) {
  let endpoint = co.wrap(function * middleware (ctx) {
    debug('handle')
    let { module: moduleName, method: methodName } = ctx.params
    let render = renderers[ camelcase(moduleName) ] || renderers[ moduleName ]
    if (!render) {
      notFoundError(ctx, `Renderer not found: ${moduleName}`)
      return
    }
    let method = render[ camelcase(methodName) ] || render[ methodName ]
    if (!method) {
      notFoundError(ctx, `Method not found: ${methodName} in renderer ${moduleName}`)
      return
    }
    let { body: args = {} } = ctx.request
    try {
      ctx.body = yield Promise.resolve(method.call(render, args))
      ctx.status = 200
    } catch (e) {
      ctx.status = 400
      ctx.body = `Invocation failed with error: ${e.message || e}`
    }
  })

  Object.assign(endpoint, {
    /**
     * Description of this middleware.
     */
    $desc: 'Serve dynamic html endpoints'
  })

  return endpoint
}

module.exports = create
