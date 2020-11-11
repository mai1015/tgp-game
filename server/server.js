// src/server.js
const { Server } = require('boardgame.io/server');
const { TGP } = require('../src/Game');
const path = require('path');
const serve = require('koa-static');

const server = Server({ games: [TGP] });
const PORT = process.env.PORT || 8000;


// Build path relative to the server.js file
const frontEndAppBuildPath = path.resolve(__dirname, '../build');
server.app.use(serve(frontEndAppBuildPath))

server.run(PORT, () => {
    server.app.use(
        async (ctx, next) => await serve(frontEndAppBuildPath)(
            Object.assign(ctx, { path: 'index.html' }),
            next
        )
    )
});
