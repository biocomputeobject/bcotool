# Installation  
  
The package is written mainly in node.js (javascript) and uses the Github and npm package management systems for download and dependency installation. The following instructions show how to download and install the package and dependencies and then verify the installation by running the test suites.

## Install dependencies

### Windows

#### 1. Install Git

https://git-scm.com/download/win

This should create a GitBash icon on your desktop or taskbar. Click on GitBash to launch a Linux terminal.

#### 2. Install node

You'll use node.js to run the bcotool code. We'll install the latest version of node.js for Windows 64-bit (currently it's node-v10.2.1-win-x64.zip), downloaded from here:

https://nodejs.org/en/download/current/

Next, open a GitBash terminal and create a directory for the node.js code:
```bash
mkdir -p ~/Desktop/tools/node
```

Move the downloaded file to the new directory:
```bash
mv ~/Downloads/node-v10.2.1-win-x64.zip ~/Desktop/tools/node
```

Unzip and rename to just the version number '10.2.1'
```bash
cd ~/Desktop/tools/node
unzip node-v10.2.1-win-x64.zip 
mv node-v10.2.1-win-x64 10.2.1
```

#### 3. Add node to your PATH

Open GitBash terminal and edit your profile file with the vi editor:
```bash
vi ~/.bash_profile
```

Hit 'i' to enable you to insert text and then add this line:

export PATH=~/Desktop/tools/node/10.2.1:$PATH


To save the file and exit the vi editor, Hit the <ESC> key then type ':wq' (without the quotes), and hit RETURN to finish. This will allow your GitBash terminal to "know" where the node executables are:

~/Desktop/tools/node/10.2.1/node 
~/Desktop/tools/node/10.2.1/npm

### OSX

#### 1. Install homebrew

Install homebrew if it's not already installed:
```bash
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

Check the homebrew version:
```bash
brew -v
```

#### 2. Install Git

```bash
brew install git
```
#### 3. Install node

```bash
brew install nodejs
```

### Ubuntu

#### 1. Install Git

```bash
sudo apt -y install git
```
### 2. Install node

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

### Centos

#### 1. Install Git

```bash
sudo yum -y install git
```
### 2. Install node

```bash
curl --silent --location https://rpm.nodesource.com/setup_10.x | sudo bash -
sudo yum -y install nodejs
```


## Install bcotool

### 1. Download from GitHub
    
Create the 'repos' directory and clone bcotool into it:
```bash
mkdir -p ~/repos
cd ~/repos/node
git clone https://github.com/biocomputeobject/bcotool
```
  
### 2. Install module dependencies

Enter the base directory and use npm to install the node module dependencies with 'npm'
```bash
cd ~/repos/bcotool
npm install
``

NB: The "npm install" command installs the production dependencies listed in the package.json file:

  "dependencies": {
    "JSON": ">=1.0.0",
    ...

... along with the development dependencies:

  "devDependencies": {
    "intern": "~3.2.2"

... into the node_modules folder.

To install only the production dependencies, use:

```bash
cd bcotool
npm install --production
```

.. or set the NODE_ENV environment variable to "production":

```bash
cd bcotool
export NODE_ENV=production
npm install
```

  
## Test bcotool

```bash
cd bcotool
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


For information on how run bcotool, review the README.md file in the base folder of the repository.

