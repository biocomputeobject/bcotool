# Installation  
  
The package is written mainly in node.js (javascript) and uses the Github and npm package management systems for download and dependency installation. The following instructions show how to download and install the package and dependencies and then verify the installation by running the test suites.

### 1. Download package
    
```bash
git clone https://hive.biochemistry.gwu.edu/git/hive/bco-validate.git
```
  
### 2. Install dependencies

#### Install npm and node

##### On OSX

Install brew
```bash
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```
Install node (and npm)
```bash
brew install node 
```
#### On Ubuntu

Remove existing /usr/bin/node link to /usr/sbin/ax25-node to avoid clash 
```bash
rm -fr /usr/bin/node
```

Install nodejs (and npm)
```bash
sudo apt-get update
sudo apt-get install node
```
Link from nodejs to node
```bash
ln -s /usr/bin/nodejs /usr/bin/node
```

#### On Centos

Install node (and npm)
```bash
sudo yum install nodejs npm --enablerepo=epel
```

#### Install dependencies

Enter the base directory and use npm to install the dependencies

```bash
cd bco-validate
npm install


````

The "npm install" command installs the production dependencies listed in the package.json file:

  "dependencies": {
    "JSON": ">=1.0.0",
    ...

... along with the development dependencies:

  "devDependencies": {
    "intern": "~3.2.2"

... into the node_modules folder.

To install only the production dependencies, use:

```bash
cd bco-validate
npm install --production
```

.. or set the NODE_ENV environment variable to "production":

```bash
cd bco-validate
export NODE_ENV=production
npm install
```

  
### 3. Run tests

```bash
cd bco-validate
node node_modules/intern/client.js config=tests/intern
```

You should get output like this:


    PASS: parse - should parse HL7 segments (16ms)
    0/1 tests failed
    PASS: validate - should validate parsed HL7 segments (1ms)
    0/1 tests failed
    PASS: db - should load parsed HL7 segments into MongoDB and retrieve by Patient ID (19ms)
    0/1 tests failed
    0/3 tests failed

    ----------------|----------|----------|----------|----------|----------------|
    File            |  % Stmts | % Branch |  % Funcs |  % Lines |Uncovered Lines |
    ----------------|----------|----------|----------|----------|----------------|
     lib/           |    73.08 |    41.67 |    64.71 |    73.08 |                |
      db.js         |     87.1 |       50 |    71.43 |     87.1 |    46,54,55,93 |
      hl7.js        |    55.56 |    33.33 |       50 |    55.56 |... 120,121,123 |
      validator.js  |      100 |       50 |      100 |      100 |                |
     lib/db/        |      100 |      100 |      100 |      100 |                |
      model.js      |      100 |      100 |      100 |      100 |                |
     lib/parser/    |    79.08 |    47.22 |    57.14 |    79.08 |                |
      index.js      |      100 |      100 |      100 |      100 |                |
      parser.js     |    89.74 |     62.5 |      100 |    89.74 |... 148,149,150 |
      serializer.js |    37.14 |        0 |        0 |    37.14 |... 54,55,58,60 |
      translate.js  |    94.59 |     87.5 |      100 |    94.59 |          39,70 |
    ----------------|----------|----------|----------|----------|----------------|
    All files       |    76.92 |    45.83 |    61.29 |    76.92 |                |
    ----------------|----------|----------|----------|----------|----------------|

