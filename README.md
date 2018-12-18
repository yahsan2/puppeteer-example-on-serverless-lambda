# puppeteer-example-on-serverless-lambda

## Check or Setup aws configure 
https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html

## Setup
``` bash
# clone repository
$ git clone git@github.com:yahsan2/puppeteer-example-on-serverless-lambda.git 
$ cd puppeteer-example-on-serverless-lambda.git 

# install dependencies
$ npm install # Or yarn install
```

## Command List
``` bash
# deploy all functions to aws lambda 
$ npm run deploy-all

# deploy a specific function on aws lambda 
$ npm run deploy -- puppeteer

# invoke a specific function on aws lambda 
$ npm run invoke -- puppeteer

# invoke a specific function on local
$ npm run local -- puppeteer

# serverless info
$ npm run info

```
