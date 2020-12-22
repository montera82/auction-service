# Introduction #

Auth Service verifies the JWT token before passing the original request to upstream services.

### Deploying
Service is deployed in aws CloudFormation

```
sls deploy -v
```

To redeploy a specific fuction ` sls deploy -f <function-name> -v

To remove existing deployment `sls remove -v`

## Gateway endpoint

https://dvkqeagsd0.execute-api.eu-west-1.amazonaws.com/{env}/{resource}

Possible values for <env> variable include `dev`, `staging` and `production`

## Taling the logs
`sls logs -f <functionName> -t`


## Endpoints:
```
    POST - /private
    POST - /public
```
