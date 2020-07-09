var AWS = require('aws-sdk/global');
var SQS = require('aws-sdk/clients/sqs');

const config = require(`${__dirname}/../config`);

DEFAULT_DELAY_SECONDS = 10 // seconds

AWS.config.region = config.region;

module.exports = class SqsProducer {

  constructor(opts={}) {
    this.sqs = new SQS({apiVersion: '2012-11-05'});
    this.delaySeconds = opts.delaySeconds || DEFAULT_DELAY_SECONDS
    this.producerId = opts.producerId;
    this.queueUrl = config.SqsQueueUrl;
    this.count = 0;
  }
  
  start() {
    var _this = this;
    setInterval(      
      function() {
        // console.log(`Sending message ${_this.getMessage()} ...`);
        _this.sendMessage();
      }, 
      1000
    );
  }

  getMessage() {
    return JSON.stringify({
      recorded_at: new Date().getTime(), 
      count: this.count++,
      producerId: this.producerId
    });
  }

  sendMessage() {

    let msg = this.getMessage();
    let params = {
      DelaySeconds: this.delaySeconds,
      MessageBody: msg,
      QueueUrl: config.SqsQueueUrl
    };

    let _this = this;
    this.sqs.sendMessage(params, function(err, data) {
        if (err) {
          console.log("Error", err);
        } else {
          let now = new Date().getTime();
          let delay = now - JSON.parse(msg).recorded_at;
          let log_msg = {
            status: "Success",
            msgId: data.MessageId,
            msg: msg,
            delay: delay
          }
          console.log(log_msg);
        }
      });

  }

}