'use strict'
const koaTrivialIpfw = require('./koa-trivial-ipfilter.js')
// const koaMount = require('koa-mount')
const koaStatic = require('koa-static')
const koaHelmet = require('koa-helmet')
const koaCompress = require('koa-compress')
const Koa = require('koa')
const koa = new Koa()

const listeningPort = 8080
const optsIp = {
	permitted: [
		/^127\.0\.0\.1$/,
		/^::1$/
	],
	banned: [
	],
	handler: async (ctx, next) => {
	}
}

const logger = () => {
	return async (ctx, next) => {
		await next()
		const rt = ctx.response.get('X-Response-Time')
		console.log(` method]${ctx.method} status]${ctx.status} ip]${ctx.ip} host/url]${ctx.host}${ctx.url} responseTime]${rt} userAgent]${ctx.request.headers['user-agent'].split(' ')[ ctx.request.headers['user-agent'].split(' ').length - 1 ]} `)
	}
}

const standardHeaders = () => {
	return async (ctx, next) => {
		ctx.response.set('Cache-Control', 'max-age=99999999999999')
		await next()
	}
}

const xResponseTime = () => {
	return async (ctx, next) => {
		const start = Date.now()
		await next()
		const ms = Date.now() - start
		ctx.set('X-Response-Time', `${ms}ms`)
	}
}

const domain = (hostname, mw) => {
	return async (ctx, next) => {
		if (ctx.host === hostname || ctx.host.split(':')[0] === hostname) {
			await mw.call(this, ctx, next)
		} else {
			await next()
		}
	}
}

koa.use(logger())
koa.use(xResponseTime())
koa.use(koaTrivialIpfw(optsIp))
koa.use(koaCompress())
koa.use(koaHelmet())
koa.use(standardHeaders())

koa.use(domain('localhost', koaStatic('dist')))

koa.listen(listeningPort)
console.log(`listening]${listeningPort}`)
