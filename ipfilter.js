// gutted this from someone elses work (removed all dependencies and kept core function; changed racist variable names to neutral ones)
// credit to nswbmw[[https://github.com/nswbmw/koa-ip/blob/1af5/index.js]]
// MIT license
module.exports = (opts) => {
  return async (ctx, next) => {
    const ip = ctx.ip
    let pass = false

    if (opts.permitted && Array.isArray(opts.permitted)) {
      pass = opts.permitted.some((regexp) => {
        return regexp.test(ip)
      })

      if (process.env.VERBOSE && !pass) {
        console.log(`NON-PERMITTED requestor]${ip} matches_no_regexp`)
      }
    }

    if (pass && opts.banned && Array.isArray(opts.banned)) {
      pass = !opts.banned.some((regexp) => {
        let isMatch = regexp.test(ip)
        if (process.env.VERBOSE && isMatch) {
          console.log(`BANNED requestor]${ip} matches_regexp]${regexp}`)
        }
        return isMatch
      })
    }

    if (pass) {
      return next()
    } else if (typeof opts.handler === 'function') {
      await opts.handler(ctx, next)
    } else {
      ctx.throw(403)
    }
  }
}
