const Router = require('express').Router;
const accessController = require('./access.controllers');

const routes = new Router();

routes.get('/login', accessController.login);
routes.post('/login', accessController.tryLogin);
routes.get('/register', accessController.register);
routes.post('/register', accessController.tryRegister);
routes.get('/logout', accessController.logout);

module.exports = routes;