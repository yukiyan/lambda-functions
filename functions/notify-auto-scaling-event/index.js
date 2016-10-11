console.log('Loading event');

const IncomingWebhooks = require('@slack/client').IncomingWebhook;
const hookUrl = process.env.HOOK_URL;
const slackChannel = process.env.CHANNEL;
const slack = new IncomingWebhooks(hookUrl);

exports.handle = (event, context, callback) => {
  const message = JSON.parse(event.Records[0].Sns.Message);
  const eventName = message.Event;
  console.log('message ->', message);
  console.log('eventName ->', eventName);

  if (eventName === 'autoscaling:EC2_INSTANCE_LAUNCH' || eventName === 'autoscaling:EC2_INSTANCE_TERMINATE') {
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
              short: true,
            },
            {
              title: 'Event name',
              value: eventName,
              short: true,
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
    slack.send(slackMessage);
    callback(null, 'success');
  } else {
    console.log('対象外のイベントなため、何もせず終了しました');
    callback(null, 'success');
  }
};
