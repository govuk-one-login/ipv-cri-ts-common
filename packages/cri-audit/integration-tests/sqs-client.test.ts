import { buildAndSendAuditEvent } from "@govuk-one-login/cri-audit";
import { pollTestHarnessForEvents } from "@govuk-one-login/cri-test-resources-helpers";
import { SessionItem, UnixMillisecondsTimestamp, UnixSecondsTimestamp } from "@govuk-one-login/cri-types";
import { randomUUID } from "node:crypto";
import { beforeEach, describe, expect, test } from "vitest";

type Event = {
  event_name: string;
  [key: string]: unknown;
};

const QUEUE_URL = process.env.SQS_QUEUE_URL;

if (!QUEUE_URL) {
  throw new Error("Missing environment variable for SQS_QUEUE_URL");
}

const TEST_HARNESS_URL = process.env.TEST_HARNESS_EXECUTE_URL;

if (!TEST_HARNESS_URL) {
  throw new Error("Missing environment variable for TEST_HARNESS_EXECUTE_URL");
}

const eventName = "TEST_EVENT";
const component_id = "TEST_COMPONENT";

describe.sequential("SQS integration tests", () => {
  let session: SessionItem;
  let sessionId: string;

  beforeEach(() => {
    sessionId = randomUUID();

    session = {
      sessionId,
      clientSessionId: "test-client-session",
      subject: "test-user",
      clientIpAddress: "127.0.0.1",
      persistentSessionId: "test-persistent-session",
      clientId: "client-id",
      expiryDate: 9999999999 as UnixSecondsTimestamp,
      attemptCount: 0,
      createdDate: Date.now() as UnixMillisecondsTimestamp,
      redirectUri: "https://account.gov.uk",
      state: "eyJsb2dnaW5nLWluIjp0cnVlfQ==",
    };
  });

  test("Should send audit event to the SQS Client and receive message from the /events endpoint", async () => {
    await buildAndSendAuditEvent(QUEUE_URL, eventName, component_id, session);

    const records = await pollTestHarnessForEvents(TEST_HARNESS_URL, eventName, sessionId);

    expect(records.length).equal(1);

    const record = records[0];

    const event = record.event as Event;

    expect(record.partitionKey).toBe(`SESSION#${sessionId}`);
    expect(event.event_name).toContain(eventName);
  });
});
