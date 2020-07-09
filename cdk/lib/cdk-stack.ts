import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
const { SqsToLambda } = require('@aws-solutions-constructs/aws-sqs-lambda');

export class CdkStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // standard SQS queue
    const sqsToLambda = new SqsToLambda(this, 'Sqs', {
      deployLambda: true,

      lambdaFunctionProps: {
        runtime: lambda.Runtime.NODEJS_10_X,
        handler: 'sqsPoller.handler',
        code: lambda.Code.asset(`${__dirname}/lambda`)
      }
    });

    // FIFO SQS queue
    const fifoSqsToLambda = new SqsToLambda(this, 'FifoSqs', {
      deployLambda: true,

      lambdaFunctionProps: {
        runtime: lambda.Runtime.NODEJS_10_X,
        handler: 'fifoSqsPoller.handler',
        code: lambda.Code.asset(`${__dirname}/lambda`)
      },
      queueProps: {
        fifo: true
      },
      deadLetterQueueProps: {
        fifo: true
      }
    });

    // Stack outputs
    new cdk.CfnOutput(this, 'SqsQueueUrl', {
      value: sqsToLambda.sqsQueue.queueUrl,
      description: 'The Standard SQS queue URL.'
    });
    new cdk.CfnOutput(this, 'FifoSqsQueueUrl', {
      value: fifoSqsToLambda.sqsQueue.queueUrl,
      description: 'The FIFO SQS queue URL.'
    });

  }
}
