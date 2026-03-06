import { CloudFormationClient, DescribeStacksCommand, Output } from "@aws-sdk/client-cloudformation";

const cfnClient = new CloudFormationClient({ region: process.env["AWS_REGION"] ?? "eu-west-2" });

export const stackOutputs = async (stackName?: string): Promise<Record<string, string>> => {
  if (!stackName) {
    throw new Error("Stack name not provided.");
  }

  const response = await cfnClient.send(new DescribeStacksCommand({ StackName: stackName }));

  const stackOutputs = response?.Stacks?.at(0)?.Outputs ?? [];

  return stackOutputs.reduce((acc: Record<string, string>, output: Output) => {
    acc[output.OutputKey!] = output.OutputValue!;
    return acc;
  }, {});
};
