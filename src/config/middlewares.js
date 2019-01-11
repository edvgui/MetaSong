const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const expressSession = require('express-session');
const multer = require('multer');

const uploadSong = multer({
    storage: multer.diskStorage({
        destination: function(req, file, cb) {
            cb(null, './src/uploads/songs/');
        },
        filename: function (req, file, cb) {
            const ext = file.originalname.split(".");
            cb(null, req.session.userId + "." + ext[ext.length - 1]);
        }
    }),
    limits: {
        fileSize: 20000000
    },
    fileFilter: function (req, file, cb) {
        const name = file.originalname;
        const sp = name.split(".");
        if (sp.length < 2 || sp[sp.length - 1] !== "mp3") cb(new Error("This file doesn't have a valid extension."));
        else cb(null, true);
    }
}).single('songFile');

const uploadImg = multer({
    storage: multer.diskStorage({
        destination: function(req, file, cb) {
            cb(null, './src/uploads/imgs/');
        },
        filename: function (req, file, cb) {
            const ext = file.originalname.split(".");
            cb(null, req.session.userId + "." + ext[ext.length - 1]);
        }
    }),
    limits: {
        fileSize: 1000000
    },
    fileFilter: function (req, file, cb) {
        const name = file.originalname;
        const sp = name.split(".");
        if (sp.length < 2 || (sp[sp.length - 1] !== "png" && sp[sp.length - 1] !== "jpg")) cb(new Error("This file doesn't have a valid extension."));
        else cb(null, true);
    }
}).single('songCover');

function mySongUpload(req, res, next) {
    uploadSong(req, res, function (err) {
        req.error = err;
        next();
    });
}

function myImgUpload(req, res, next) {
    uploadImg(req, res, function (err) {
        req.error = err;
        next();
    });
}

function setUp(server) {
    server.use(bodyParser.json());
    server.use(bodyParser.urlencoded({ extended: false }));
    server.use(expressValidator());
    server.use(express.static(path.join(__dirname, '../public')));
    server.use(expressSession({secret: 'mysignature', saveUninitialized: false, resave: false}));
}

function loadInfos(req, res, next) {
    req.session.urlRequested = req.url;
    next();
}

function requiresLogin(req, res, next) {
    if (req.session && req.session.userId) {
        res.locals.loggedIn = true;
        res.locals.urlRequested = req.session.urlRequested;
        res.locals.user = true;
        res.locals.admin = req.session.admin;
        return next();
    } else {
        res.locals.loggedIn = false;
        res.locals.urlRequested = req.session.urlRequested;
        req.session.urlDeclined = req.session.urlRequested;
        res.locals.user = false;
        res.locals.admin = false;
        return res.render('login_required', { title: 'Login required', layout: 'empty' });
    }
}

module.exports = {
    setUp,
    loadInfos,
    requiresLogin,
    mySongUpload,
    myImgUpload
};