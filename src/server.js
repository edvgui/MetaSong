const express = require('express');
const path = require('path');
const http = require('http');
const database = require('./config/database');
const middlewares = require('./config/middlewares');
const constants = require('./config/constants');
const routes = require('./modules');
const hbs = require('express-handlebars').create({
    layoutsDir: path.join(__dirname, "views/layouts"),
    partialsDir: path.join(__dirname, "views/partials"),
    defaultLayout: 'layout',
    extname: 'hbs',
    helpers: {
        appname: 'MetaSong',
        ifVisible: function (admin, requireAdmin, options) {
            return (admin || !requireAdmin) ? options.fn(this) : options.inverse(this);
        },
        ifActive: function (url, path, options) {
            return (url && url.indexOf(path) !== -1) ? options.fn(this) : options.inverse(this);
        }
    }
});

const server = express();

server.engine('hbs', hbs.engine);
server.set('view engine', 'hbs');
server.set('views', path.join(__dirname, 'views'));

middlewares.setUp(server);

routes(server);

database();

// For http
http.createServer(server).listen(constants.PORT_HTTP, err => {
    if(err) {
        throw err;
    } {
        console.log(`Server ${process.env.NODE_ENV} HTTP listen on port ${constants.PORT_HTTP}.`);
    }
});