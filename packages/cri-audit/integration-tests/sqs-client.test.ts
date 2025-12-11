import { buildAndSendAuditEvent } from "@govuk-one-login/cri-audit";
import { pollForTestHarnessEvents } from "@govuk-one-login/cri-test-resources-helpers";
import { SessionItem, UnixMillisecondsTimestamp, UnixSecondsTimestamp } from "@govuk-one-login/cri-types";
import { v4 as uuidv4 } from "uuid";
import { beforeEach, describe, expect, test } from "vitest";

const QUEUE_URL = process.env.SQS_QUEUE_URL;

if (!QUEUE_URL) {
  throw new Error("Missing environment variable for SQS_QUEUE_URL");
}

const eventName = "TEST_EVENT";
const component_id = "TEST_COMPONENT";

describe("SQS integration tests", () => {
  let session: SessionItem;
  let sessionId: string;

  beforeEach(() => {
    sessionId = uuidv4().toString();

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

  test("Should send message to the SQS Client and receive the message from the /events endpoint", async () => {
    await buildAndSendAuditEvent(QUEUE_URL, eventName, component_id, session);

    const records = await pollForTestHarnessEvents(eventName, sessionId);

    expect(records.length).toBeGreaterThan(0);

    const record = records[0];

    expect(record.partitionKey).toBe(`SESSION#${sessionId}`);
    expect(record.event.event_name).toContain(eventName);
  });
});
