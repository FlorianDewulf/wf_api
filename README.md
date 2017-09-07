# WF API

Consume the Warframe API. To request it with ajax, an Express server is available as a proxy (we can't use ajax to the Warframe API)

## Requirements

- [Docker](https://www.docker.com/get-docker) (if you don't have/want Node)
- [Node](https://nodejs.org/en/) (if you don't have/want Docker)
- [Ruby](https://www.ruby-lang.org/fr/downloads/) (optionnal, for the Rakefile)

---

## Installation

If you use docker, you don't have to do anything.
If you don't use docker :

    $ npm i && cd server && npm i


## Start the application

    $ rake start

or

    $ docker-compose -p wf_api -f etc/docker/docker-compose.dev.yml up -d dev

or if you don't use docker
    
    $ npm run dev-server
    $ cd server
    $ npm start

## Stop the application

    $ rake stop

or

    $ docker stop wfapi_dev_1 wfapi_dev-server_1

or if you don't use docker, stop the two previous process launched by the start application

## Restart the application

    $ rake restart

or the process of "Stop the application" and "Start the application"

## Build the application (front)

    $ rake build

or

    $ docker-compose -p wf_api -f etc/docker/docker-compose.build.yml up build

or if you don't use docker
    
    $ npm run build

It will generate a bunch of files in the dist folder :
- app.css : The style from src/assets/stylesheets/index.scss
- app.js : The javascript from src/main.js
- vendor.js : The library to use your code and which brings the library from the node_modules (the dependencies). Big file but don't change that much except if you add a dependency in the package.json

## Launch the tests 

    $ rake test

or

    $ docker-compose -p wf_api -f etc/docker/docker-compose.dev.yml up tester

or if you don't use docker

    $ npm run test

---

## Languages & tools

### JavaScript

- [ES6+](es6-features.org) is the Javascript version used to write code with the last features of the langage.
- [Webpack](https://webpack.js.org/concepts/) is the server which runs for the development.
- [Webpack Uglify](https://www.npmjs.com/package/uglifyjs-webpack-plugin) is the tool who render a production version of your build. [This link](https://stackoverflow.com/questions/42375468/uglify-syntaxerror-unexpected-token-punc) helped me a lot.
- [ESLint](https://eslint.org/) allows you to check your code.
- [Babel](https://babeljs.io/) transpiles your code ES6+ to ES5.

### Stylesheet

- [Sass](http://sass-lang.com/) is the most famous stylesheet language who extends the css with awesome features and a better syntax.
