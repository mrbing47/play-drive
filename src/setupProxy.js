const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
	app.use(
		"/uc",
		createProxyMiddleware({
			target: "https://drive.google.com/",
			changeOrigin: true,
		})
	);
};
