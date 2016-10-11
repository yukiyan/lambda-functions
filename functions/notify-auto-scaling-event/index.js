console.log('Loading event');

const URL = require('url');
const https = require('https');
const hookUrl = process.env.HOOK_URL;
const slackChannel = process.env.CHANNEL;

exports.handle = (event, context, callback) => {
  const message = JSON.parse(event.Records[0].Sns.Message);
  const eventName = message.Event;
  console.log('message ->', message);
  console.log('eventName ->', eventName);

  if (eventName === 'autoscaling:EC2_INSTANCE_LAUNCH' || eventName === 'autoscaling:EC2_INSTANCE_TERMINATE') {
    const slackMessage = {
      username: 'オートスケールイベント知らせるくん',
      channel: slackChannel,
      icon_emoji: ':speaking_head_in_silhouette:',
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
    const body = JSON.stringify(slackMessage);
    const options = URL.parse(hookUrl);
    options.method = 'POST';
    options.headers = {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(body),
    };

    const postReq = https.request(options, (res) => {
      const chunks = [];
      res.setEncoding('utf8');
      res.on('data', chunk => chunks.push(chunk));
      return res;
    });

    postReq.write(body);
    postReq.end();
    callback(null, 'success');
  } else {
    console.log('対象外のイベントなため、何もせず終了しました');
    callback(null, 'success');
  }
};
