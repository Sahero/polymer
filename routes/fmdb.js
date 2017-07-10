let express = require('express');
let config = require('../config/config');
let request = require('request');
let _ = require('lodash');
let router = module.exports = express.Router();

//let env = express().get('env');
let env ="production";

//Get token for accessing data using default login information
router.get('/getToken', function(req, res) {
    if(env=="development"){
        res.json({token:'1234'});
        return;
    }
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

//get record count of the provided layout
router.get('/getRecordCount/:layoutname', function(req, res) {
    if(env=="development"){
        res.json(require('../data/' + req.params.layoutname + '.json').length);
    }
    else {
        let url = config.filemaker.protocol + '://' + config.filemaker.ip + '/fmi/rest/api/record/' + config.filemaker.solution + '/' + req.params.layoutname;
        console.log(url);
        // Make the API Call
        request({"rejectUnauthorized": false,"method": 'GET',"url": url,"headers": {"FM-data-token": req.header('fm-data-token'), "Content-Type": "application/json"},
            "agentOptions": config.filemaker.selfSignedCertificate, "json": true
        }, (error, response, body) => {
            if (error) {
                console.log(error);
            }
            else {
                //console.log(body);
                res.json(body.data.length);
            }
        });
    }
});

//get record count of the provided layout
router.post('/getRecordCount/:layoutname', function(req, res) {
    if(env=="development"){
        res.json(require('../data/' + req.params.layoutname + '.json').length);
    }
    else {
        var _body = Object.keys(req.body)[0];
        //console.log(JSON.parse(_body));

        let url = config.filemaker.protocol + '://' + config.filemaker.ip + '/fmi/rest/api/find/' + config.filemaker.solution + '/' + req.params.layoutname;
        // Make the API Call
        request({"rejectUnauthorized": false,"method": 'POST',"url": url,"headers": {"FM-data-token": req.header('fm-data-token'), "Content-Type": "application/json"},
            "agentOptions": config.filemaker.selfSignedCertificate, "json": true, body: JSON.parse(_body)
        }, (error, response, body) => {
            if (error) {
                console.log(error);
            }
            else {
                //console.log(body);
                res.json(body.data.length);
            }
        });
    }
});

//Get list data
router.get('/getList/:layoutname', function(req, res) {
    res.redirect('/fm/getList/'+req.params.layoutname+'/1');
});

router.get('/getList/:layoutname/:page', function(req, res) {
    res.redirect('/fm/getList/'+req.params.layoutname+'/'+req.params.page+'/20');
});

router.get('/getList/:layoutname/:page/:numofrecords', function(req, res) {
    /*console.log(req.params.layoutname);
     console.log(req.params.page);
     console.log(req.params.numofrecords);
     var page = req.params.page;*/
    var offset = ((parseInt(req.params.page)) * parseInt(req.params.numofrecords)) + 1;

    if(env=="development"){
        res.json(require('../data/' + req.params.layoutname + '.json'));
    }
    else {
        let url = config.filemaker.protocol + '://' + config.filemaker.ip + '/fmi/rest/api/record/' + config.filemaker.solution + '/' + req.params.layoutname+'?offset='+offset+'&range='+req.params.numofrecords;
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
                //console.log(body);
                res.json(body.data);
            }
        });
    }
});



router.get('/getDetail/:layoutname/:recordid', function(req, res) {
//console.log(req);
    //console.log(req.headers);
    if(env=="development"){
        //res.json(require('../data/' + req.params.layoutname + '.json'));
        let detailsJson = require('../data/'+req.params.layoutname+'.json');;
        //console.log();
        var toJson = _.find(detailsJson, {recordId: req.params.recordid});
        //console.log(toJson);
        if(toJson===undefined){
            res.json(null);
        }
        else{
            res.json([toJson]);
        }
    }
    else{
        console.log(req.header('fm-data-token'));
        let url = config.filemaker.protocol+'://'+config.filemaker.ip+'/fmi/rest/api/record/'+config.filemaker.solution+'/'+req.params.layoutname+'/'+req.params.recordid;
        //console.log(url);

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

//to update and create new records
router.put('/getDetail/:layoutname/:recordid', function(req, res) {
    if(env=="development"){
        res.json("success dev");
        return;
    }

    var _body = Object.keys(req.body)[0];
    //console.log(_body);
    let url = config.filemaker.protocol+'://'+config.filemaker.ip+'/fmi/rest/api/record/'+config.filemaker.solution+'/'+req.params.layoutname+'/'+req.params.recordid;
    //console.log(url);

    // Make the API Call
    request({
        "rejectUnauthorized": false,
        "method" : 'PUT',
        "url" : url,
        "headers" : {"FM-data-token": req.header('fm-data-token'), "Content-Type" : "application/json"},
        "agentOptions" : config.filemaker.selfSignedCertificate,
        "json": true,
        "body" : JSON.parse(_body)
    }, (error, response, body) => {
        if(error){
            console.log(error);
            res.json(error);
        }
        else{
            console.log(body);
            res.json(body);
        }
    });
});

//Using POST method to filter the list data
/*
 router.post('/getList/:layoutname', function(req, res) {
 console.log(env);
 if(env=="development"){
 res.json(require('../data/' + req.params.layoutname + '.json'));

 }
 else {
 console.log(req.body);
 var _body = Object.keys(req.body)[0];
 console.log(JSON.parse(_body));

 let url = config.filemaker.protocol + '://' + config.filemaker.ip + '/fmi/rest/api/find/' + config.filemaker.solution + '/' + req.params.layoutname;
 console.log(url);
 // Make the API Call
 request({
 "rejectUnauthorized": false,
 "method": 'POST',
 "url": url,
 "headers": {"FM-data-token": req.header('fm-data-token'), "Content-Type": "application/json"},
 "agentOptions": config.filemaker.selfSignedCertificate,
 "json": true,
 "body" : JSON.parse(_body)
 }, (error, response, body) => {
 if (error) {
 console.log(error);
 }
 else {
 //console.log(body);
 res.json(body.data);
 }
 });
 }
 });
 */


router.post('/getList/:layoutname', function(req, res) {
    res.redirect(307,'/fm/getList/'+req.params.layoutname+'/1');
});

router.post('/getList/:layoutname/:page', function(req, res) {
    res.redirect(307,'/fm/getList/'+req.params.layoutname+'/'+req.params.page+'/20');
});

router.post('/getList/:layoutname/:page/:numofrecords', function(req, res) {
    /*console.log(req.params.layoutname);
     console.log(req.params.page);
     console.log(req.params.numofrecords);
     var page = req.params.page;*/
    var offset = ((parseInt(req.params.page)) * parseInt(req.params.numofrecords)) + 1;
    //console.log(req.body);

    var _body = Object.keys(req.body)[0];
    //console.log(_body);
    //console.log(JSON.parse(_body));
    _filterBody = _body.substring(0, _body.lastIndexOf("}")) + ',"range":"'+req.params.numofrecords+'"'+ ',"offset":"'+offset+'"}';
    //console.log(_filterBody);
    //_body={"query":[{"Status": "open"}    ],"range": "2","offset": "1"};
    if(env=="development"){
        res.json(require('../data/' + req.params.layoutname + '.json'));
    }
    else {
        let url = config.filemaker.protocol + '://' + config.filemaker.ip + '/fmi/rest/api/find/' + config.filemaker.solution + '/' + req.params.layoutname;
        console.log(url);
        // Make the API Call
        request({
            "rejectUnauthorized": false,
            "method": 'POST',
            "url": url,
            "headers": {"FM-data-token": req.header('fm-data-token'), "Content-Type": "application/json"},
            "agentOptions": config.filemaker.selfSignedCertificate,
            "json": true,
            "body" : JSON.parse(_filterBody)
        }, (error, response, body) => {
            if (error) {
                console.log(error);
            }
            else {
                //console.log(body);
                res.json(body.data);
            }
        });
    }
});