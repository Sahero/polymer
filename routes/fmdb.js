let express = require('express');
let config = require('../config/config');
let request = require('request');
let _ = require('lodash');
let router = module.exports = express.Router();

//let env = express().get('env');
let env ="production";
router.get('/getToken', function(req, res) {

    let url = config.filemaker.protocol+'://'+config.filemaker.ip+'/fmi/rest/api/auth/'+config.filemaker.solution;

    // Make the API Call
    request({
        "rejectUnauthorized": false,
        "method" : 'POST',
        "url" : url,
        "headers" : config.filemaker.headers,
        "agentOptions" : config.filemaker.selfSignedCertificate,
        "json" : true,
        "body" : config.filemaker.body
    }, (error, response, body) => {


        if(!error) {
            res.json(body);
            // res.json("["+body+"]");
        }
        else {
            res.json(error);
        }
    });

});

router.get('/getList/:layoutname', function(req, res) {
    console.log(env);
    if(env=="development"){
        res.json(require('../data/' + req.params.layoutname + '.json'));
    }
    else {
        let url = config.filemaker.protocol + '://' + config.filemaker.ip + '/fmi/rest/api/record/' + config.filemaker.solution + '/' + req.params.layoutname;
        console.log(url);
        // Make the API Call
        request({
            "rejectUnauthorized": false,
            "method": 'GET',
            "url": url,
            "headers": {"FM-data-token": req.header('fm-data-token'), "Content-Type": "application/json"},
            "agentOptions": config.filemaker.selfSignedCertificate,
            "json": true
        }, (error, response, body) => {
            if (error) {
                console.log(error);
            }
            else {
                res.json(body.data);
            }
        });
    }
});

/*
 router.get('/getProjectsList', function(req, res) {
 let url = config.filemaker.protocol+'://'+config.filemaker.ip+'/fmi/rest/api/record/'+config.filemaker.solution+'/L121_PROJECTS_List_View';

 // Make the API Call
 request({
 "rejectUnauthorized": false,
 "method" : 'GET',
 "url" : url,
 "headers" : {"FM-data-token": req.header('fm-data-token'), "Content-Type" : "application/json"},
 "agentOptions" : config.filemaker.selfSignedCertificate,
 "json": true
 }, (error, response, body) => {
 if(error){
 console.log(error);
 }
 else{
 res.json(body.data);
 }
 });
 });*/

/*

 router.get('/getProjectsDetail/:recordid', function(req, res) {
 //console.log(req.params.recordid);
 //console.log(req.header('fm-data-token'));
 let url = config.filemaker.protocol+'://'+config.filemaker.ip+'/fmi/rest/api/record/'+config.filemaker.solution+'/L120_Projects_Data_entry/'+req.params.recordid;
 console.log(url);

 // Make the API Call
 request({
 "rejectUnauthorized": false,
 "method" : 'GET',
 "url" : url,
 "headers" : {"FM-data-token": req.header('fm-data-token'), "Content-Type" : "application/json"},
 "agentOptions" : config.filemaker.selfSignedCertificate,
 "json": true
 }, (error, response, body) => {
 if(error){
 console.log(error);
 let detailsJson = require('../data/L120_Projects_Data_entry.json');
 //console.log();
 var toJson = _.find(detailsJson, {recordId: req.params.recordid});
 res.json(toJson);
 }
 else{
 //console.log(body);
 res.json(body.data);
 }
 });
 });
 */


router.get('/getDetail/:layoutname/:recordid', function(req, res) {
//console.log(req);
    if(env=="development"){
        //res.json(require('../data/' + req.params.layoutname + '.json'));
        let detailsJson = require('../data/'+req.params.layoutname+'.json');;
        //console.log();
        var toJson = [_.find(detailsJson, {recordId: req.params.recordid})];
        res.json(toJson);
    }
    else{
        console.log(req.header('fm-data-token'));
        let url = config.filemaker.protocol+'://'+config.filemaker.ip+'/fmi/rest/api/record/'+config.filemaker.solution+'/'+req.params.layoutname+'/'+req.params.recordid;
        console.log(url);

        // Make the API Call
        request({
            "rejectUnauthorized": false,
            "method" : 'GET',
            "url" : url,
            "headers" : {"FM-data-token": req.header('fm-data-token'), "Content-Type" : "application/json"},
            "agentOptions" : config.filemaker.selfSignedCertificate,
            "json": true
        }, (error, response, body) => {
            if(error){
                console.log(error);

            }
            else{
                //console.log(body);
                res.json(body.data);
            }
        });
    }
});

/*

 router.get('/getStaffsList', function(req, res) {
 //console.log(req.headers);
 //console.log(req.header('fm-data-token'));
 let url = config.filemaker.protocol+'://'+config.filemaker.ip+'/fmi/rest/api/record/'+config.filemaker.solution+'/L130_STAFF_Data_Entry';

 // Make the API Call
 request({
 "rejectUnauthorized": false,
 "method" : 'GET',
 "url" : url,
 "headers" : {"FM-data-token": req.header('fm-data-token'), "Content-Type" : "application/json"},
 "agentOptions" : config.filemaker.selfSignedCertificate,
 "json": true
 }, (error, response, body) => {
 if(error){
 console.log(error);
 }
 else{
 res.json(body.data);
 }
 });
 });
 */
/*

 var localProjectList = require('../data/L121_PROJECTS_List_View.json');
 router.get('/getLocalProjectsList', function(req, res){
 //    console.log(req.query);
 //console.log();
 //_.filter(summary.data, ['category.parent', 'Food'])
 console.log(req.query.size);
 if(Object.keys(req.query).length !== 0) {
 var toSend = _.filter(localProjectList, ['fieldData.Status', 'Open']);
 res.json(toSend);
 }
 else{
 res.json(localProjectList);
 }
 });

 let detailsJson = require('../data/L130_STAFF_Data_Entry.json');
 router.get('/getLocalProjectsDetail/:recordid', function(req, res){
 console.log(req.params.recordid);
 console.log(_.find(detailsJson, {recordId: req.params.recordid}));

 res.json({'rest':'rest'});
 /!*if (_.find(detailsJson, {recordId: req.params.recordid})) {
 return res.json({success:false, msg:'A user with that username already exists'});
 }
 res.json(require('../data/L121_PROJECTS_List_View.json'));*!/
 });

 router.get('/getLocalStaffsList', function(req, res){
 res.json(require('../data/L130_STAFF_Data_Entry.json'));
 });*/
