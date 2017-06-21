/**
 * Created by Sagar on 6/9/2017.
 */
var bcs = require('../data/bettercallsaul.json');
var express = require('express');
var jwt     = require('express-jwt');
var config  = require('../config/config');
var _ = require('lodash');

var router = module.exports = express.Router();

// Validate access_token
var jwtCheck = jwt({
    secret: config.secret,
    //audience: config.audience,
    //issuer: config.issuer
});


function getData(){
    var totalEpisodes = bcs.length;
    return bcs;
}

// Check for scope
function requireScope(scope) {
    console.log(scope);
    return function (req, res, next) {
        var has_scopes = req.user.scope === scope;
        console.log(has_scopes);
        if (!has_scopes) {
            res.sendStatus(401);
            return;
        }
        next();
    };
}

//router.use('/data', jwtCheck, requireScope('full_access'));
//router.use('/data', jwtCheck, requireScope('full_access'));

router.get('/data/random-episode', function(req, res) {
    res.json(getData());
});

router.get('/data/season/:season', function(req, res) {
    //var season = {};
    res.json(_.filter(bcs, {"season" : _.parseInt(req.params.season)}));
});

// router.get('/data/season/:season/episode', function(req, res) {
//     res.redirect('/data' );
// });


router.get('/data/season/:season/episode/:episode', function(req, res) {
    //var season = {};
    res.json(_.filter(bcs,
        {
            "season" : _.parseInt(req.params.season),
            "number" : _.parseInt(req.params.episode)
        }));
});




