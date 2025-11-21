import { SendMessageCommand, SQSClient } from "@aws-sdk/client-sqs";
import { SessionItem, UnixMillisecondsTimestamp, UnixSecondsTimestamp } from "@govuk-one-login/cri-types";
import { mockClient } from "aws-sdk-client-mock";
import { describe, expect, it } from "vitest";
import { buildAuditUser, buildBaseAuditEvent, sendAuditEvent } from "../src/index.js";
import { AuditUser, BaseAuditEvent } from "../src/types.js";

const sqsMock = mockClient(SQSClient);

sqsMock.resolves({
  MessageId: "cool-message",
  $metadata: {
    httpStatusCode: 200,
  },
});

const mockSession: SessionItem = {
  clientSessionId: "client-session-id",
  clientId: "client-id",
  expiryDate: 9999999999 as UnixSecondsTimestamp,
  sessionId: "session-id",
  subject: "sub",
  attemptCount: 0,
  createdDate: Date.now() as UnixMillisecondsTimestamp,
  redirectUri: "https://account.gov.uk",
  state: "eyJsb2dnaW5nLWluIjp0cnVlfQ==",
};

describe("buildAuditUser()", () => {
  it("builds an AuditUser as expected", () => {
    const auditUser = buildAuditUser(mockSession);

    expect(auditUser).toStrictEqual<AuditUser>({
      govuk_signin_journey_id: "client-session-id",
      session_id: "session-id",
      user_id: "sub",
    });
  });

  it("builds an AuditUser with extra session fields when provided", () => {
    const auditUser = buildAuditUser({
      ...mockSession,
      clientIpAddress: "0.0.0.0",
      persistentSessionId: "persistent-session-id",
    });

    expect(auditUser).toStrictEqual<AuditUser>({
      govuk_signin_journey_id: "client-session-id",
      session_id: "session-id",
      user_id: "sub",
      ip_address: "0.0.0.0",
      persistent_session_id: "persistent-session-id",
    });
  });
});

describe("buildBaseAuditEvent()", () => {
  it("builds a base event as expected", () => {
    const baseEvent = buildBaseAuditEvent("my-cool-event", "https://component.account.gov.uk");

    const testTime = Date.now();

    expect(baseEvent).toStrictEqual<BaseAuditEvent>({
      component_id: "https://component.account.gov.uk",
      event_name: "my-cool-event",
      event_timestamp_ms: expect.any(Number),
      timestamp: expect.any(Number),
    });
    expect(baseEvent.timestamp).toBeGreaterThan(testTime / 1000 - 10);
    expect(baseEvent.timestamp).toBeLessThan(testTime / 1000 + 1);
    expect(baseEvent.event_timestamp_ms).toBeGreaterThan(testTime - 10000);
    expect(baseEvent.event_timestamp_ms).toBeLessThan(testTime + 1000);
  });
});

describe("sendAuditEvent()", () => {
  it("builds and sends an audit event as expected", () => {
    sendAuditEvent("queue.com", "my-event", "https://component.account.gov.uk", mockSession);
    expect(sqsMock).toHaveReceivedCommandWith(SendMessageCommand, {
      QueueUrl: "queue.com",
      MessageBody: expect.stringMatching(
        /(?=.*"govuk_signin_journey_id":"client-session-id")(?=.*"event_name":"my-event")/,
      ),
    });
  });
});
