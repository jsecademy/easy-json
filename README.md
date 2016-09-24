### Easy-JSON | Crazy fast file system JSON reader and writer 
This package will help you create and read in JSON files into your application. 

This can be helpful for a series of use cases. 

1. Temporary Data Store
2. Custom configurations
3. Bypass nodes caching of reading in JSON

**Installing Module**
---

```
npm install easy-json --save
```

**Getting started with this module**
---

```javascript
const EasyJSON = require('easy-json');
const root = require('app-root-path');

const destination = `${root.path}/config`;
const fileName = "config.json";
const jay = EasyJSON.getInstance(fileName, destination);
//... use jay object here
```

The operations that are available to you.

![UML Diagram](https://codewithintent.com/wp-content/uploads/2016/08/easy-json-uml.png)

* `EasyJSON.getInstance(fileName, destination)` gets the object to use in your program sets default name of file and destination
* `.saveJSON(data)` save any javascript data to disk
* `.getJSON()` gets JSON data from disk
* `.path = "path/name"` set the property of the parent path
* `.path` returns the set path
* `.name = "config.json"` sets the name of file to write to disk
* `.name` gets the name of the file

*This module was made possible thanks to [LearnMEAN.com](https://www.learnmean.com/)*
