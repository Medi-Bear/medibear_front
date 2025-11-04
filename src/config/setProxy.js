const {createProxyMiddleware} = require('http-proxy-middleware');

const envIp = import.meta.env.VITE_CORS_ALLOWED_ORIGINS;
console.log("envIp", envIp);
module.exports = function (app) {
    app.use(
        '/api',
        createProxyMiddleware({
            target: envIp,
            changeOrigin: true,
        })
    );
};
