const Router = require('express').Router;
const usersController = require('./users.controllers');

const routes = new Router();

routes.get('/account', usersController.account);

module.exports = routes;