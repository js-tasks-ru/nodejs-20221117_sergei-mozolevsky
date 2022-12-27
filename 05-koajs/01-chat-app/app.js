const path = require('path');
const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

let pendingResponses = [];

router.get('/subscribe', async (ctx, next) => {

    const msg = await new Promise(resolve => {
        pendingResponses.push(resolve)
    })

     ctx.body = msg
});

router.post('/publish', async (ctx, next) => {

    const msg = ctx.request.body.message;

    if (msg && pendingResponses.length) {
        pendingResponses.forEach(resolve => {
            resolve(msg)
        })
    
        pendingResponses = [];
    }

    ctx.status = 200;
});

app.use(router.routes());

module.exports = app;
