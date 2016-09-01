import * as chai from 'chai';
import EasyJSON = require("../src/easy-json");
import * as root from 'app-root-path';

const assert = chai.assert;

describe('Singleton', function () {
    let jay:EasyJSON;
	before(function (done) {
        const destination = `${root.path}/config`;
        jay = EasyJSON.getInstance('config.json', destination);
        done();
	});
	it('Single singleton is received', function () {
        assert.isObject(jay);
	});

	it('Fails on double instantiation', function () {
        assert.throws(() => {
            try{
                let myJSON = new EasyJSON();
            }catch(e){
                throw e;
            }
        }, Error, "Yikes you can\'t create this object! try EasyJSON.getInstance()");
	});
});

describe('Setting getter sand setters for path value', function () {
    let jay:EasyJSON;
    const destination = `${root.path}/config`;
	before(function (done) {
        jay = EasyJSON.getInstance('config.json', destination);
        done();
	});

	it('Path values match on instantiation', function () {
        assert.equal(jay.path, destination, '== path values match up');
	});

	it('Getter is working', function () {
        assert.equal(jay.path, destination, '== path values match up');
	});

    it('Path values match on set', function () {
        const path = `${root.path}/custom-scripts`;
        jay.path = path;
        assert.equal(jay.path, path, '== custom set path values match up');
	});
});

describe('Saving to disk', function () {
    let jay:EasyJSON;
	before(function (done) {
        const destination = `${root.path}/config`;
        jay = EasyJSON.getInstance('config.json', destination);
        done();
	});
	it('Successfully saved data to disk', function () {
        const data = [{
            name: "Brandy",
            age: 22
        }, {
            name: "Ferguson",
            age: 32
        }];
        assert.isUndefined(jay.saveJSON(data));
	});

	it('Fails on an invalid destination', function () {
        const data = [{
            name: "Brandy",
            age: 22
        }, {
            name: "Ferguson",
            age: 32
        }];
        jay.name = `${root.path}/config/automated`;
        jay.path = 'configurations.json';
        assert.throws(() => {
            try{
                jay.saveJSON(data);
            }catch(e){
                throw e;
            }
        }, Error);
	});
});

describe('Reading from disk', function () {
    let jay:EasyJSON;
    const users = [{
        name: "Brandy",
        age: 22
    }, {
        name: "Ferguson",
        age: 32
    }];
	before(function (done) {
        const destination = `${root.path}/config`;
        jay = EasyJSON.getInstance('config.json', destination);
        jay.saveJSON(users);
        done();
	});

	it('Successfully received a promise', function () {
       const promise = jay.getJSON();
       assert.isDefined(promise);
       assert.typeOf(promise, 'Promise');
	});

	it('Successfully read in file', function () {
       const promise = jay.getJSON();
       return promise.then((data) => {
           assert.deepEqual(data, users, 'data is not equal to each other');
       });
	});

	it('Reading from an undefined path', function () {
        jay.name = undefined;
        jay.path = undefined;
        const promise = jay.getJSON();
        return promise.catch((error)=>{
            assert.throws(() => {
                throw error;
            }, Error);
        });
	});

	it('Reading from an invalid path', function () {
        jay.name = `${root.path}/config/automated`;
        jay.path = 'configurations.json';
        const promise = jay.getJSON();
        return promise.catch((error)=>{
            assert.throws(() => {
                throw error;
            }, Error);
        });
	});
});