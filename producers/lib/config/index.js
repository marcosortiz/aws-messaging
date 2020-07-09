var config = require('./config.json');
                    
module.exports = {
  region: config.region,
  SqsQueueUrl: config.SqsQueueUrl,
  FifoSqsQueueUrl: config.FifoSqsQueueUrl
};
