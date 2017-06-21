var express = require('express');
var _       = require('lodash');
var config  = require('../config/config');
var jwt     = require('jsonwebtoken');
var encryption = require('../utilities/crypto');

var router = module.exports = express.Router();

var users = require('../data/users.json');

function createIdToken(user) {
    return jwt.sign(_.omit(user, 'password'), config.secret, { expiresIn: 60*60*5 });
}

function createAccessToken() {
    return jwt.sign({
        //iss: config.issuer,
        //aud: config.audience,
        exp: Math.floor(Date.now() / 1000) + (60 * 60),
        scope: 'full_access',
        sub: "sub",
        jti: genJti(), // unique identifier for the token
        alg: 'HS256'
    }, config.secret);
}

// Generate Unique Identifier for the access token
function genJti() {
    let jti = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 16; i++) {
        jti += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return jti;
}

router.post('/register', function(req, res) {

    var username = req.body.username;
    var password = req.body.password;
    var query = {username: username};

    if (!username || !password) {
        return res.json({success:false, msg:'You must send the username and the password'});
    }

    if (_.find(users, query)) {
        return res.json({success:false, msg:'A user with that username already exists'});
    }

    var newUser = req.body;
    newUser.id = _.parseInt(_.max(users, 'id').id) + 1;
    newUser.salt = encryption.generateSalt();
    newUser.password = encryption.generateHashedPassword(newUser.salt, newUser.password);
    users.push(newUser);

    return res.json({
        success: true,
        msg:'Please login'
        //,newUser: newUser
        // id_token: createIdToken(newUser),
        // access_token: createAccessToken(),

        // data: {username: newUser.username, id: newUser.id}
    });
});

router.post('/login', function(req, res) {
    //console.log(1);

    var username = req.body.username;
    var password = req.body.password;
    var query = {username: username};

    //console.log(password);
    if (!username || !password) {
        return res.json({success:false, msg:'You must send the username and the password'});
    }

    var user = _.find(users, query);
    //console.log(user);
    if (!user) {
        return res.json({success:false, msg:'Wrong username or password'});
    }

    if (encryption.generateHashedPassword(user.salt, password) !== user.password) {
        return res.json({success:false, msg:'Wrong username or password!'});
    }

    return res.status(201).send({
        success: true,
        id_token: createIdToken(user),
        access_token: createAccessToken(),
        data: {username: user.username, id: user.id}
    });
});
