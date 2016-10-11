# lambda-functions
yukiyan's lambda functions.

## Usage

### Set environment variables for AWS

```sh
$ direnv edit .
export AWS_ACCESS_KEY_ID=YOUR_AWS_ACCESS_KEY_ID
export AWS_SECRET_ACCESS_KEY=YOUR_AWS_SECRET_ACCESS_KEY
export AWS_REGION=YOUR_AWS_REGION
```

### functions/notify-auto-scaling-event
#### Set environment variables for Slack

```json
$ cat ./functions/notify-auto-scaling-event/.env.json
{
  "SLACK_WEBHOOK_URL": "https://hooks.slack.com/services/HOGE/FUGA/HOGEFUGA",
  "CHANNEL": "#FUGA"
}
```

#### apex deploy

```
$ apex deploy --env-file ./functions/notify-auto-scaling-event/.env.json notify-auto-scaling-event
```
