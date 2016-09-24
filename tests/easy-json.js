"use strict";
var chai = require('chai');
var root = require('app-root-path');
var easy_json_1 = require('../src/easy-json');
var assert = chai.assert;
describe('Singleton', function () {
    var easy;
    before(function (done) {
        var destination = root.path + "/config";
        easy = easy_json_1.EasyJSON.getInstance('config.json', destination);
        done();
    });
    it('Is a single instance being returned?', function () {
        assert.isObject(easy);
    });
    it('Fails on double instantiations', function () {
        assert.throw(function () {
            try {
                var myJSON = new easy_json_1.EasyJSON();
            }
            catch (e) {
                throw e;
            }
        }, Error, 'Yikes you can\'t create this object! try EasyJSON.getInstance()');
    });
});
describe('Settings the getter and setter for the path value', function () {
    var easy;
    var destination = root.path + "/config";
    before(function (done) {
        easy = easy_json_1.EasyJSON.getInstance('config.json', destination);
        done();
    });
    it('Path value match on instance', function () {
        assert.equal(easy.path, destination, '=== path values match up');
    });
    it('Path values match on set', function () {
        var path = root.path + "/custom-scripts";
        easy.path = path;
        assert.equal(easy.path, path, '=== custom path values match up');
    });
});
describe('Settings the getter and setter for the name value', function () {
    var easy;
    var destination = root.path + "/config";
    before(function (done) {
        easy = easy_json_1.EasyJSON.getInstance('config.json', destination);
        done();
    });
    it('Name value match on instance', function () {
        assert.equal(easy.name, 'config.json', '=== name values match up');
    });
    it('Name value match on set', function () {
        var name = "custom-scripts.json";
        easy.name = name;
        assert.equal(easy.name, name, '=== custom name values match up');
    });
});
describe('Saving to Disk', function () {
    var easy;
    before(function (done) {
        var destination = root.path + "/config";
        easy = easy_json_1.EasyJSON.getInstance('config.json', destination);
        done();
    });
    it('Save to Disk', function () {
        var data = [{
                name: "brandy",
                age: 22
            }, {
                name: "ferguson",
                age: 32
            }];
        assert.isUndefined(easy.saveJSON(data));
    });
    it('Fails on invalid destination', function () {
        var data = [{
                name: "brandy",
                age: 22
            }, {
                name: "ferguson",
                age: 32
            }];
        easy.name = root.path + "/config/blank";
        easy.path = 'configurations.json';
        assert.throws(function () {
            try {
                easy.saveJSON(data);
            }
            catch (err) {
                throw err;
            }
        }, Error);
    });
});
describe('Reading from Disk', function () {
    var easy;
    var data = [{
            name: "brandy",
            age: 22
        }, {
            name: "ferguson",
            age: 32
        }];
    before(function (done) {
        var destination = root.path + "/config";
        easy = easy_json_1.EasyJSON.getInstance('config.json', destination);
        easy.saveJSON(data);
        done();
    });
    it('Promise received', function () {
        var promise = easy.getJSON();
        assert.isDefined(promise);
        assert.typeOf(promise, 'Promise');
    });
    it('Read from Disk', function () {
        var promise = easy.getJSON();
        return promise.then(function (raw) {
            assert.deepEqual(raw, data, 'Data is not the same!');
        });
    });
    it('Fails on invalid destination', function () {
        easy.path = undefined;
        easy.name = undefined;
        var promise = easy.getJSON();
        return promise.catch(function (error) {
            assert.throws(function () {
                throw error;
            }, Error);
        });
    });
});
