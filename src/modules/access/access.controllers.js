const User = require('./../users/users.models');
const constants = require('./../../config/constants');
const crypto = require('crypto');

function filteredBody(body, whitelist) {
    const items = {};

    Object.keys(body).forEach(key => {
        if (whitelist.indexOf(key) >= 0) {
            items[key] = body[key];
        }
    });

    return items;
}

async function login(req, res) {
    if (req.session.userId) return res.redirect('/');
    res.render('login', { title: 'Login',
        layout: 'empty',
        attempt: req.session.attempt_log,
        errors: req.session.errors_log,
        data: req.session.data
    });
}

async function tryLogin(req, res) {
    if (req.session.userId) return res.redirect('/');
    const email = req.body.email;
    const password = req.body.password;

    let isPasswordValid = false;
    let isUserValid = false;
    req.check('email', "This isn't a valid email address.").isEmail();
    try {
        const users = await User.find({ email: email });
        if (users.length === 1) {
            isUserValid = true;
            const hash = crypto.createHash('sha256').update(password, 'utf-8').digest('hex');
            isPasswordValid = users[0].password === hash;
        }

        const errors = req.validationErrors();

        if (errors || !isPasswordValid || !isUserValid) {
            req.session.attempt_log = true;
            req.session.errors_log = errors;
            if (!errors) req.session.errors_log = [];
            if (!isPasswordValid) req.session.errors_log.push({msg: "Wrong password."});
            if (!isUserValid) req.session.errors_log.push({msg: "This user isn't registered yet."});
            req.session.data = {
                email: email
            };
            res.redirect('/access/login');
        } else {
            req.session.userId = users[0]._id;
            req.session.admin = users[0].admin;
            if (req.session.urlDeclined)
                res.redirect(req.session.urlDeclined);
            else
                res.redirect('/');
        }
    } catch (error) {
        req.session.attempt_log = true;
        req.session.errors_log = [{msg: error.message}];
        req.session.data = {
            email: email
        };
        res.redirect('/access/login');
    }


}

async function register(req, res) {
    if (req.session.userId) return res.redirect('/');
    res.render('register', { title: 'Register',
        layout: 'empty',
        attempt: req.session.attempt_reg,
        errors: req.session.errors_reg,
        data: req.session.data
    });
}

async function tryRegister(req, res) {
    if (req.session.userId) return res.redirect('/');
    const firstName = req.body.first_name;
    const lastName = req.body.last_name;
    const email = req.body.email;
    const pswd = req.body.password;
    const cpswd = req.body.confirmPassword;

    req.check('first_name', 'Invalid first name').isString().isLength({min: 1});
    req.check('last_name', 'Invalid last name').isString().isLength({min: 1});
    req.check('email', 'Invalid email address').isEmail();
    req.check('password', 'Password must be at least 8 character').isLength({min: 8});
    req.check('password', "Password doesn't match its confirmation").equals(cpswd);

    const errors = req.validationErrors();
    if (errors || ! req.body.terms) {
        req.session.attempt_reg = true;
        req.session.errors_reg = errors;
        if (!errors) req.session.errors_reg = [];
        if (!req.body.terms) req.session.errors_reg.push({msg: 'You must accept the terms and conditions to use this app.'});
        req.session.data = {
            first_name: firstName,
            last_name: lastName,
            email: email
        };
        res.redirect('/access/register');
    } else {
        const u = filteredBody(req.body, constants.WHITELIST.user.create);
        try {
            const user = await User.create(u);
            req.session.userId = user._id;
            res.redirect('/user/account');
        } catch (error) {
            req.session.attempt_reg = true;
            req.session.errors_reg = [{msg: error.message}];
            req.session.data = {
                first_name: firstName,
                last_name: lastName,
                email: email
            };
            res.redirect('/access/register');
        }
    }
}

async function logout(req, res) {
    req.session.destroy();
    res.redirect('/access/login');
}

module.exports = {
    login,
    tryLogin,
    register,
    tryRegister,
    logout
};