# Introduction #

A simple service for Auction utilizing serverless framework.

### Deploying
Service is deployed in aws CloudFormation

```
sls deploy -v
```

To redeploy a specific fuction ` sls deploy -f <function-name> -v

To remove existing deployment `sls remove -v`

## Gateway endpoint

https://kvnxffh2hc.execute-api.eu-west-1.amazonaws.com/<env>/<handler>

Possible values for <env> variable include `dev`, `staging` and `production`