var sinon = require('sinon');
var proxyquire = require('proxyquire');
var express = require('express');
var mongoClient = require('mongodb').MongoClient;
var app= express();
var expect = require('chai').expect;
var Q = require('q');
var callback = sinon.spy();
var MongoMock = require("mongomock");
var dealerCollection = {"dealer":[{"dealerName" : "Usharani Kotyada","type" : "dealer","dealerId" : "d002","Email" : "ukotyada@miraclesoft","Password" : "Ukotyada","Phone" : "7660917458","marketSegment" : "Residential","country" : "United States","state" : "Washington"}]
};
var mongo = new MongoMock(dealerCollection);

var cb = function(err,val)
{
    return val;
};

var request = require('supertest');

var MongoStub = {
    MongoClient:{
        connect: function(err,cb){
            cb(null,mongo);
        }
    
}
    
};
var appStub  = proxyquire(".././app.js",{'mongodb':MongoStub}); 
describe('Services Test', function () {

    describe('Test Login', function () {


        it('should validate login users', function(done)
        {
           //var result= appStub.post(authenticateCustomer');
           request(appStub).get('/authenticateCustomer').send({Email:'ukotyada',Password:'Ukotyada'})
           .end(function(err,res){
              expect(JSON.parse(res.text).output).to.be.not.null;
              expect(JSON.parse(res.text).output).to.be.an('array');
              done();
           });
        });

        it('should fail for invalid  users', function(done)
        {
           //var result= appStub.post(authenticateCustomer');
           request(appStub).get('/authenticateCustomer').send({Email:'test',Password:'test'})
           .end(function(err,res){
               
              expect(JSON.parse(res.text).output).to.be.empty;
              done();
           });
        });
    });


});
