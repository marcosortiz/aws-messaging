var SqsProducer = require('../lib/sqsProducer');


var params = { producerId: "P1" };
var SqsProducer = new SqsProducer(params);
SqsProducer.start();