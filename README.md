# koala-face

## The Decentest Little Static Server

We leverage Koa to make a trivially secure bandwidth efficient static file server!

## Basic Configuration

### filter routing by host

Default route in serve.js.
`koa.use(domain('localhost', koaStatic('dist')))`
is suitable for development testing by default.

Your real web address will go also in serve.js. N.B., routes will match in the order registered.
`koa.use(domain('mysite.net', koaStatic('dist')))`
This would route the requestor of `mysite.net` to the assets available in `./dist/` (and could just as well point to any other statically servable folder).

Any files you put in the indicated folder will be accessible to visitors.

### ipfilter with regular expressions

ipfilter drops all ips by default except localhost on ipv4 and ipv6. This is suitable for development testing only - this way, it is also secured by default should this be deployed unconfigured!

In server.js, edit handler function or permitted and banned lists.

```
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
```

To permit all requests, change `permitted` to `[ /.*/ ]`.

**Happy Serving!**
