/**
 * EasyJSON Read and Write JSON to the Filesystem
 */
import * as fs from "fs";

class EasyJSON{
    private static instance: EasyJSON;
    private _path: string;
    private _name: string;

    public constructor() {
        if (EasyJSON.instance) {
            throw new Error("Yikes you can't create this object! try EasyJSON.getInstance()");
        }
    }

    // Save data to disk
    public saveJSON(json) {
        let fileName = `${this._path}/${this._name}`;
        const data = JSON.stringify(json);

        let pathExist = false;
        try {
            fs.accessSync(this._path, fs.F_OK);
            pathExist = true;
        } catch (e) {
            throw e;
        }

        if(!pathExist){
            fs.mkdirSync(this._path); // Create path if it does not exist
        }

        // This will override any files if they exist
        fs.writeFileSync(fileName, data, 'utf8'); // Will throw error if it fails
    }

    // Get data from Disk
    public getJSON(){
        const promise = new Promise((resolve, reject) => {
            if(EasyJSON.isset(this._path) && EasyJSON.isset(this._name)){
                let fileName = `${this._path}/${this._name}`;
                if (fs.lstatSync(fileName).isFile()) {
                        fs.readFile(fileName, 'utf8', (err, data) => {
                            if (err){
                                    reject(err);
                            }else{
                                resolve(JSON.parse(data));
                            }
                        });
                } else {
                     reject(new Error('Invalid File! Path cant be resolved'));
                }
            }else{
                // Path and Name are Required
                reject(new Error('Path and Name are Required'));
            }
        });
        return promise;
    }

    // Set project Path
    public set path(path:string) {
        this._path = path;
    }

    // Get project Path
    public get path() {
        return this._path;
    }

    // Set file name
    public set name(name) {
        this._name = name;
    }

    // Get file name
    public get name() {
        return this.name;
    }

    public static getInstance(name?:string, location?:string): EasyJSON {
        if (EasyJSON.instance === undefined) {
            EasyJSON.instance = new EasyJSON();
        }
        if(EasyJSON.isset(name)){
                EasyJSON.instance._name = name;
        }
        if(EasyJSON.isset(name)){
                EasyJSON.instance._path = location;
        }
        return EasyJSON.instance;
    }

    private static isset(value):boolean{
        let set = false;
        if(value !== undefined || value !== null){
            set = true;
        }
        return set;
    }
}

export = EasyJSON;