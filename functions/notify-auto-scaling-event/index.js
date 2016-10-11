console.log('Loading event');

const IncomingWebhooks = require('@slack/client').IncomingWebhook;
const slack = new IncomingWebhooks(process.env.SLACK_WEBHOOK_URL);
const slackChannel = process.env.CHANNEL;

const sendSlack = payload => new Promise((resolve, _reject) => {
  resolve(slack.send(payload));
});

exports.handle = (event, context, callback) => {
  const message = JSON.parse(event.Records[0].Sns.Message);
  const slackMessage = {
    username: 'オートスケールイベント知らせるくん',
    channel: slackChannel,
    iconEmoji: ':speaking_head_in_silhouette:',
    attachments: [
      {
        fallback: 'オートスケールイベントが発生しました',
        color: '#36a64f',
        author_name: 'notify-auto-scaling-event',
        title: 'オートスケールイベントが発生しました :rotating_light:',
        fields: [
          {
            title: 'Auto scaling group',
            value: message.AutoScalingGroupName,
            short: false,
          },
          {
            title: 'Event name',
            value: message.Event.match(/autoscaling:(\w+)/)[1],
            short: false,
          },
          {
            title: 'Message',
            value: message.Cause,
            short: false,
          },
        ],
        footer: 'EC2 Auto scale → SNS → lambda → slack',
      },
    ],
  };

  if (message.Event === 'autoscaling:EC2_INSTANCE_LAUNCH' || message.Event === 'autoscaling:EC2_INSTANCE_TERMINATE') {
    sendSlack(slackMessage)
      .then((response) => {
        console.log('response ->', response);
        callback(null, 'success');
      })
      .catch((error) => {
        console.log(error, error.stack);
        callback(error);
      });
  } else {
    console.log('対象外のイベントなため、何もせず終了しました');
    callback(null, 'success');
  }
};
