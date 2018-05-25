# bco-validator

[![stable](http://badges.github.io/stability-badges/dist/stable.svg)](http://github.com/badges/stability-badges)
[![NPM](https://nodei.co/npm/hl7-dictionary.png)](https://www.npmjs.com/package/bco-validator)

## Install

Install via [NPM](https://www.npmjs.com/):

```shell
npm install bco-validator
```

Or get a browserified packaged source file (replace 2.7.1 with your desired version):

* 2.7.1
    * [hl7dictionary.2.7.1.js](https://raw.githubusercontent.com/fernandojsg/hl7-dictionary/master/dist/hl7dictionary.2.7.1.js)
    * [hl7dictionary.2.7.1.min.js](https://raw.githubusercontent.com/fernandojsg/hl7-dictionary/master/dist/hl7dictionary.2.7.1.min.js)

## Usage

Simply import the module to access the datatype methods:

```javascript
var bcoValidator = require('bco-validator');

## API

To view the interactive API documentation and test individual API methods, run the following commands:

cd api
npm install
node server.js

... then browse to:

http://localhost:8080


For a static list of the API methods, open the YML-format OpenAPI file with an editor:

api/swagger.yml


### Overview

This repository contains the following files in the 'data' directory: 

bco-core.json          Field definitions for datatype files
bco-primitives.json    Primitive data types (implemented in code)
bco-datatypes.json         Datatype definitions for BCO specification files
bco-spec.json          BCO specification file defining BCO datatypes
bco-1.json             Example BCO file

bco-core.json
-----------



# API

The 'api' subdirectory contains the tools needed to generate, display and live test the API. The [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md](OpenAPI/Swagger) specification is used to describe all API components. This provides the following features:
  - Communicate functional requirements clearly to all stakeholders  
  - Ease of top-down development   
  - YAML-format API specification files

Follow these steps to generate the swagger.yml API specification file and view it in your browser:

#### 1. Install development dependencies

```bash
cd bco-validate
npm install --devDependencies
```

#### 2. Generate swagger.yml file

```bash
cd api
./swagger-jsdoc.js -o ./swagger.yml -d ./swaggerDef.js ../bin/*.js 
```  

#### 3. Start API server

```bash
cd bco-validate/api
node ./api-server.js
```

#### 4. Start API response server

```bash
cd bco-validate/api
node ./rest-server.js
```

#### 5. Browse to API

```bash
open http://localhost:8080/docs
```

#### 6. TROUBLESHOOTING

#####  Usage Examples

./bcotool datatype ../data/bco/datatype.json


