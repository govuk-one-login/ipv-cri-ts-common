import { SQSClient } from "@aws-sdk/client-sqs";

let sqsClient: SQSClient | undefined;

export function setSqsClient(client: SQSClient) {
  sqsClient = client;
}

export function getSqsClient(): SQSClient {
  sqsClient ??= new SQSClient({ region: "eu-west-2" });

  return sqsClient;
}
