var AWS = require('aws-sdk/global');
var SQS = require('aws-sdk/clients/sqs');

const config = require(`${__dirname}/../config`);

AWS.config.region = config.region;

// Create an SQS service object
var sqs = new SQS({apiVersion: '2012-11-05'});
var params = {
   DelaySeconds: 10,
   MessageBody: JSON.stringify({ 
     "recorded_at": new Date().getTime(),
     "producer": "P1"
    }),
   QueueUrl: config.SqsQueueUrl
 };

 sqs.sendMessage(params, function(err, data) {
    if (err) {
      console.log("Error", err);
    } else {
      console.log("Success", data.MessageId);
    }
  });