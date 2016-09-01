"use strict";
var chai = require('chai');
var easy_json_1 = require('../src/easy-json');
var root = require('app-root-path');
var assert = chai.assert;
describe('Singleton', function () {
    var jay;
    before(function (done) {
        var destination = root.path + "/config";
        jay = easy_json_1.EasyJSON.getInstance('config.json', destination);
        done();
    });
    it('Single singleton is received', function () {
        assert.isObject(jay);
    });
    it('Fails on double instantiation', function () {
        assert.throws(function () {
            try {
                var myJSON = new easy_json_1.EasyJSON();
            }
            catch (e) {
                throw e;
            }
        }, Error, "Yikes you can\'t create this object! try EasyJSON.getInstance()");
    });
});
describe('Setting getter sand setters for path value', function () {
    var jay;
    var destination = root.path + "/config";
    before(function (done) {
        jay = easy_json_1.EasyJSON.getInstance('config.json', destination);
        done();
    });
    it('Path values match on instantiation', function () {
        assert.equal(jay.path, destination, '== path values match up');
    });
    it('Getter is working', function () {
        assert.equal(jay.path, destination, '== path values match up');
    });
    it('Path values match on set', function () {
        var path = root.path + "/custom-scripts";
        jay.path = path;
        assert.equal(jay.path, path, '== custom set path values match up');
    });
});
describe('Saving to disk', function () {
    var jay;
    before(function (done) {
        var destination = root.path + "/config";
        jay = easy_json_1.EasyJSON.getInstance('config.json', destination);
        done();
    });
    it('Successfully saved data to disk', function () {
        var data = [{
                name: "Brandy",
                age: 22
            }, {
                name: "Ferguson",
                age: 32
            }];
        assert.isUndefined(jay.saveJSON(data));
    });
    it('Fails on an invalid destination', function () {
        var data = [{
                name: "Brandy",
                age: 22
            }, {
                name: "Ferguson",
                age: 32
            }];
        jay.name = root.path + "/config/automated";
        jay.path = 'configurations.json';
        assert.throws(function () {
            try {
                jay.saveJSON(data);
            }
            catch (e) {
                throw e;
            }
        }, Error);
    });
});
describe('Reading from disk', function () {
    var jay;
    var users = [{
            name: "Brandy",
            age: 22
        }, {
            name: "Ferguson",
            age: 32
        }];
    before(function (done) {
        var destination = root.path + "/config";
        jay = easy_json_1.EasyJSON.getInstance('config.json', destination);
        jay.saveJSON(users);
        done();
    });
    it('Successfully received a promise', function () {
        var promise = jay.getJSON();
        assert.isDefined(promise);
        assert.typeOf(promise, 'Promise');
    });
    it('Successfully read in file', function () {
        var promise = jay.getJSON();
        return promise.then(function (data) {
            assert.deepEqual(data, users, 'data is not equal to each other');
        });
    });
    it('Reading from an undefined path', function () {
        jay.name = undefined;
        jay.path = undefined;
        var promise = jay.getJSON();
        return promise.catch(function (error) {
            assert.throws(function () {
                throw error;
            }, Error);
        });
    });
    it('Reading from an invalid path', function () {
        jay.name = root.path + "/config/automated";
        jay.path = 'configurations.json';
        var promise = jay.getJSON();
        return promise.catch(function (error) {
            assert.throws(function () {
                throw error;
            }, Error);
        });
    });
});
