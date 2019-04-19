# koala-face

## The Decentest Little Static Server

We leverage Koa to make a trivially secure bandwidth efficient static file server!

- **ipfilter** Permit and Ban IPs OOB!
- **koa-helmet** Improved security, protected OOB!
- **koa-compress** Enables compression, fast OOB!
- **koa-static** Static server, unlimited instances OOB!
- **koa** Ties it all together OOB!

## Basic Configuration

### ipfilter with regular expressions

ipfilter drops all ips by default except localhost on ipv4 and ipv6. This is suitable for development testing only! It is also secured by default should this be deployed unconfigured.

In server.js, edit handler function or permitted and banned lists. By default, reject

`const optsIp = {
	permitted: [
		/^127\.0\.0\.1$/,
		/^::1$/
	],
	banned: [
	],
	handler: async (ctx, next) => {
	}
}`

### filter routing by host

Default route `koa.use(domain('localhost', koaStatic('dist')))` is suitable for development testing only!
`koa.use(domain('mysite.net', koaStatic('dist')))` would point the public server to the same relatively addressed folder (and could just as well point to any other statically servable folder).
