import { SendMessageCommand } from "@aws-sdk/client-sqs";
import { logger } from "@govuk-one-login/cri-logger";
import { SessionItem, UnixMillisecondsTimestamp, UnixSecondsTimestamp } from "@govuk-one-login/cri-types";
import { getSqsClient } from "./sqs-client.js";
import { AuditEvent, AuditUser, BaseAuditEvent } from "./types.js";

export { setSqsClient } from "./sqs-client.js";

export function buildAuditUser(session: SessionItem): AuditUser {
  return {
    govuk_signin_journey_id: session.clientSessionId,
    session_id: session.sessionId,
    user_id: session.subject,
    ...(session.clientIpAddress && { ip_address: session.clientIpAddress }),
    ...(session.persistentSessionId && { persistent_session_id: session.persistentSessionId }),
  };
}

export function buildBaseAuditEvent(eventName: string, componentId: string): BaseAuditEvent {
  const timestamp = Date.now() as UnixMillisecondsTimestamp;
  const secondsTimestamp = Math.round(timestamp / 1000) as UnixSecondsTimestamp;

  return {
    component_id: componentId,
    event_name: eventName,
    event_timestamp_ms: timestamp,
    timestamp: secondsTimestamp,
  };
}

export async function sendAuditEvent(queueUrl: string, auditEvent: AuditEvent<unknown, unknown>) {
  logger.info(`Sending audit event...`);

  const response = await getSqsClient().send(
    new SendMessageCommand({
      QueueUrl: queueUrl,
      MessageBody: JSON.stringify(auditEvent),
    }),
  );

  logger.info(
    `Successfully fired ${auditEvent.event_name} event - SQS message id: '${response.MessageId}'; response code: ${response.$metadata?.httpStatusCode}`,
  );
}

export async function buildAndSendAuditEvent(
  queueUrl: string,
  eventName: string,
  componentId: string,
  session: SessionItem,
  additionalContext?: {
    evidence?: Record<string, unknown>;
    extensions?: Record<string, unknown>;
    restricted?: Record<string, unknown>;
  },
) {
  logger.info(`Building ${eventName} audit event...`);

  const auditEvent: AuditEvent<unknown, unknown> = {
    user: buildAuditUser(session),
    ...buildBaseAuditEvent(eventName, componentId),
    ...additionalContext,
  };

  await sendAuditEvent(queueUrl, auditEvent);
}
