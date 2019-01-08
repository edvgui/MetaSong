const accessRoutes = require('./access/access.routes');
const usersRoutes = require('./users/users.routes');
const appRoutes = require('./app/app.routes');
const middlewares = require('./../config/middlewares');


module.exports = function(server) {
    server.use('/', middlewares.loadInfos);

    server.use('/access', accessRoutes);

    server.use('/user', middlewares.requiresLogin, usersRoutes);
    server.use('/app', middlewares.requiresLogin, appRoutes);

    server.get('/', function(req, res, next) {
        res.redirect('/app');
    });

    // Change the 404 message modifing the middleware
    server.use(function(req, res, next) {
        res.render('page_not_found', { title: 'Oops! Page not found.'});
    });
};
