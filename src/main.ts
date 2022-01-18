import { App, Construct, Stack, StackProps } from '@aws-cdk/core';
import { PolicyStatement, Role, ServicePrincipal, ManagedPolicy } from '@aws-cdk/aws-iam';

export class IamStack extends Stack {
  public readonly lambdarole: Role;
  constructor(scope: Construct, id: string, props: StackProps = {}) {
    super(scope, id, props);

    this.lambdarole = new Role(this, 'IamRole', {
      assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
      managedPolicies: [
        ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'),
      ],
    });
    this.lambdarole.addToPolicy(new PolicyStatement({
      resources: ['*'],
      actions: [
        'ec2:DescribeInstances',
        'ec2:StartInstances',
        'ec2:StopInstances',
      ],
    }));
  }
}

// for development, use account/region from cdk cli
const allEnv = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

const app = new App();

new IamStack(app, 'cdk-iam-stack', { env: allEnv });

app.synth();
