'use strict'
const Koa = require('koa');
const compress = require('koa-compress');
const serve = require('koa-better-serve');

const app = new Koa();
app.use(compress({
	filter: (content_type) => {
		return /text/i.test(content_type)
	},
	threshold: 2048,
	flush: require('zlib').Z_SYNC_FLUSH
}));

app.use(serve('/dist', '/'));

// logger
const log_x_response_time = async (ctx, next) => {
	await next();
	const rt = ctx.response.get('X-Response-Time');
	console.log(`${ctx.method} ${ctx.host}${ctx.url} - ${rt} - ${ctx.request.headers["user-agent"]}`);
};
app.use(log_x_response_time);

// x-response-time
const x_response_time = async (ctx, next) => { const start = Date.now();
	await next();
	const ms = Date.now() - start;
	ctx.set('X-Response-Time', `${ms}ms`)
};
app.use(x_response_time);

// response
const hello_world = async ctx => {
	ctx.body = 'Hello World! Love, Koa';
};
const hello_locals = async ctx => {
	ctx.body = 'Hello Locals! Love, Koa';
};
app.use(async ctx => {
	if (ctx.url === '/locals') hello_locals(ctx);
	else if (ctx.host == 'localhost:8080') hello_world(ctx);
	ctx.response.status = 200;
	ctx.response.type = 'text/plain; charset=utf-8';
	ctx.response.set('Cache-Control', 'max-age=99999999999999');
});

// listen
app.listen(8080);
console.log('8080 alive');
