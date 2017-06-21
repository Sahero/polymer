var express = require('express');
//var FileMaker = require('../filemaker/filemaker-connector');
var config = require('../config/config');
var request = require('request');
var _ = require('lodash');
var router = module.exports = express.Router();
/*var filemaker = new FileMaker(
 {
 "protocol" : config.filemaker.protocol,
 "ip" : config.filemaker.ip,
 "solution" : config.filemaker.solution,
 "headers" : config.filemaker.headers,
 "body" : config.filemaker.body,
 "selfSignedCertificate" : config.filemaker.selfSignedCertificate
 }
 );*/
/*
 function getUrl(flag){
 if(flag==="login"){
 return config.filemaker.protocol+'://'+config.filemaker.ip+'/fmi/rest/api/auth/'+config.filemaker.solution;
 }
 }
 function getBody(flag){
 if(flag==="login"){
 return {"user" : "sagar", "password" : "sagar2017", "layout": "L121_PROJECTS_List_View"};
 }
 }

 function getToken(){
 var token =
 request({
 "rejectUnauthorized": false,
 "method" : 'POST',
 "auth":{"user" : "sagar", "password" : "sagar2017", "layout": "L121_PROJECTS_List_View"},
 "url" : getUrl("login"),
 "headers" : config.filemaker.headers,
 "agentOptions" : config.filemaker.selfSignedCertificate,
 "json" : true,
 //        "body" : getBody("login"),

 }, (error, response, body) => {
 console.log(body);
 if(!error) {
 return body;

 }
 else {
 return "ss";
 }
 });

 return token;
 }

 router.get('/test', function(req, res) {
 var url = config.filemaker.protocol+'://'+config.filemaker.ip+'/fmi/rest/api/auth/'+config.filemaker.solution;
 var token = "test";
 request.post({
 "rejectUnauthorized": false,
 "method" : 'POST',
 "url" : url,
 "headers" : config.filemaker.headers,
 "agentOptions" : config.filemaker.selfSignedCertificate,
 "json" : true,
 "body" : config.filemaker.body
 })
 .on('response', function(response, body){
 //console.log(body);
 console.log("response");
 console.log(response.statusCode);
 })

 ;
 https://{{server}}/fmi/rest/api/record/MAI/L121_PROJECTS_List_View
 });*/

router.get('/getToken', function(req, res) {
    var url = config.filemaker.protocol+'://'+config.filemaker.ip+'/fmi/rest/api/auth/'+config.filemaker.solution;

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

        //var arr = _.values(body);
        //c/onsole.log(arr);

        if(!error) {
            res.json(body);
            // res.json("["+body+"]");
        }
        else {
            res.json(error);
        }
    });

});


router.get('/getProjectsList', function(req, res) {
    //console.log(req.headers);
    //console.log(req.header('fm-data-token'));
    var url = config.filemaker.protocol+'://'+config.filemaker.ip+'/fmi/rest/api/record/'+config.filemaker.solution+'/L121_PROJECTS_List_View';

    // Make the API Call
    request({
        "rejectUnauthorized": false,
        "method" : 'GET',
        "url" : url,
        "headers" : {"FM-data-token": req.header('fm-data-token'), "Content-Type" : "application/json"},
        "agentOptions" : config.filemaker.selfSignedCertificate,
        "json": true
    }, (error, response, body) => {

        res.json(body.data);
    });
});


router.get('/getProjectsDetail/:recordid', function(req, res) {
    //console.log(req.params.recordid);
    //console.log(req.header('fm-data-token'));
    var url = config.filemaker.protocol+'://'+config.filemaker.ip+'/fmi/rest/api/record/'+config.filemaker.solution+'/L120_Projects_Data_entry/'+req.params.recordid;
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
        res.json(body.data);
    });
});

var bcs = require('../data/projectsList.json');
router.get('/test', function(req, res){
    res.json(bcs);
});