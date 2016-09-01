"use strict";
/**
 * EasyJSON Read and Write JSON to the Filesystem
 */
var fs = require("fs");
var EasyJSON = (function () {
    function EasyJSON() {
        if (EasyJSON.instance) {
            throw new Error("Yikes you can't create this object! try EasyJSON.getInstance()");
        }
    }
    // Save data to disk
    EasyJSON.prototype.saveJSON = function (json) {
        var fileName = this._path + "/" + this._name;
        var data = JSON.stringify(json);
        var pathExist = false;
        try {
            fs.accessSync(this._path, fs.F_OK);
            pathExist = true;
        }
        catch (e) {
            throw e;
        }
        if (!pathExist) {
            fs.mkdirSync(this._path); // Create path if it does not exist
        }
        // This will override any files if they exist
        fs.writeFileSync(fileName, data, 'utf8'); // Will throw error if it fails
    };
    // Get data from Disk
    EasyJSON.prototype.getJSON = function () {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            if (EasyJSON.isset(_this._path) && EasyJSON.isset(_this._name)) {
                var fileName = _this._path + "/" + _this._name;
                if (fs.lstatSync(fileName).isFile()) {
                    fs.readFile(fileName, 'utf8', function (err, data) {
                        if (err) {
                            reject(err);
                        }
                        else {
                            resolve(JSON.parse(data));
                        }
                    });
                }
                else {
                    reject(new Error('Invalid File! Path cant be resolved'));
                }
            }
            else {
                // Path and Name are Required
                reject(new Error('Path and Name are Required'));
            }
        });
        return promise;
    };
    Object.defineProperty(EasyJSON.prototype, "path", {
        // Get project Path
        get: function () {
            return this._path;
        },
        // Set project Path
        set: function (path) {
            this._path = path;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EasyJSON.prototype, "name", {
        // Get file name
        get: function () {
            return this.name;
        },
        // Set file name
        set: function (name) {
            this._name = name;
        },
        enumerable: true,
        configurable: true
    });
    EasyJSON.getInstance = function (name, location) {
        if (EasyJSON.instance === undefined) {
            EasyJSON.instance = new EasyJSON();
        }
        if (EasyJSON.isset(name)) {
            EasyJSON.instance._name = name;
        }
        if (EasyJSON.isset(name)) {
            EasyJSON.instance._path = location;
        }
        return EasyJSON.instance;
    };
    EasyJSON.isset = function (value) {
        var set = false;
        if (value !== undefined || value !== null) {
            set = true;
        }
        return set;
    };
    return EasyJSON;
}());
module.exports = EasyJSON;
