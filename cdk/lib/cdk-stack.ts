import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
const { SqsToLambda } = require('@aws-solutions-constructs/aws-sqs-lambda');

export class CdkStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    new SqsToLambda(this, 'Sqs', {
      deployLambda: true,
      lambdaFunctionProps: {
        runtime: lambda.Runtime.NODEJS_10_X,
        handler: 'sqsPoller.handler',
        code: lambda.Code.asset(`${__dirname}/lambda`)
      }
    });
  }
}
