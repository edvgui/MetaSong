const Router = require('express').Router;
const appController = require('./app.controllers');
const middlewares = require('./../../config/middlewares');

const routes = new Router();

routes.get('/', appController.home);
routes.post('/upload', middlewares.mySongUpload, appController.homeWithFile);
routes.post('/search', appController.homeWithSearch);
routes.get('/data/:id', appController.homeWithData);
routes.post('/download', middlewares.myImgUpload, appController.downloadSong);
routes.post('/save', middlewares.myImgUpload, appController.saveSong);
routes.get('/reset', appController.resetSong);
routes.get('/img/:img', appController.getImage);
routes.get('/song/:song', appController.getSong);
//routes.get('/add', appController.addToLibrary);

module.exports = routes;