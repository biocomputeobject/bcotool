# bcotool

## Installation

See INSTALL.md file for instructions.

## Usage

### Validate a datatype file:

```bash
bin/datatype data/bco/datatype.json
```

You should see this output if the file validates correctly (it should):

```bash
Validation errors: 
{
  "errors": []
}
```

### Validate a BCO file:

```bash
bin/bco data/bco/bco-1.json
``` 

You should see this output:

```bash
Validation errors: 
{
  "errors": []
}
```

### Overview

The data/bco repository contains the following files: 

bco-core.json          Field definitions for datatype files
bco-primitives.json    Primitive data types (implemented in code)
bco-datatypes.json     Datatype definitions for BCO specification files
bco-spec.json          BCO specification file defining BCO datatypes
bco-1.json             Example BCO file


### API

#### Quick start
To view interactive Application Programming Interface (API) documentation and test individual API methods, run the following commands:

```bash
cd api
npm install
node server.js
```

And then browse to:

http://localhost:8080

#### Developer information

The 'api' subdirectory contains the tools needed to generate, display and live test the API. The [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md](OpenAPI/Swagger) specification is used to describe all API components. OpenAPI provides the following advantages:
  - Communicate functional requirements clearly to all stakeholders  
  - Ease of top-down development   
  - YAML-format API specification files

To view the static list of bcotool API methods, open the OpenAPI file with an editor:

```bash
vi api/swagger.yml
```

To generate the swagger.yml API specification file, follow these steps:

##### 1. Install development dependencies

```bash
cd bcotool
npm install --devDependencies
```

##### 2. Generate swagger.yml file from *.js files 

```bash
cd api
./swagger-jsdoc.js -o ./swagger.yml -d ./swaggerDef.js ../lib/*.js 
```  

##### 3. Start API server

```bash
node ./api-server.js
```

##### 4. Start API response server

```bash
node ./rest-server.js
```

##### 5. Browse to API

```bash
open http://localhost:8080/docs
```

