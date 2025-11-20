import { SendMessageCommand } from "@aws-sdk/client-sqs";
import { sqsClient } from "@govuk-one-login/cri-aws-clients";
import { logger } from "@govuk-one-login/cri-logger";
import { SessionItem, UnixMillisecondsTimestamp, UnixSecondsTimestamp } from "@govuk-one-login/cri-types";
import { AuditEvent, AuditUser, BaseAuditEvent } from "./types.js";

/** Maps a session to the correct structure for use in a 'user' field. */
export function buildAuditUser(session: SessionItem): AuditUser {
  return {
    govuk_signin_journey_id: session.clientSessionId,
    session_id: session.sessionId,
    user_id: session.subject,
    ...(session.clientIpAddress && { ip_address: session.clientIpAddress }),
    ...(session.persistentSessionId && { persistent_session_id: session.persistentSessionId }),
  };
}

/** Constructs the minimum required fields for a typical audit event. */
export function buildBaseAuditEvent(eventName: string, componentId: string): BaseAuditEvent {
  logger.info(`Building ${eventName} audit event ...`);

  const timestamp = Date.now() as UnixMillisecondsTimestamp;
  const secondsTimestamp = Math.round(timestamp / 1000) as UnixSecondsTimestamp;

  return {
    component_id: componentId,
    event_name: eventName,
    event_timestamp_ms: timestamp,
    timestamp: secondsTimestamp,
  };
}

/** Builds and sends an audit event to SQS. */
export async function sendAuditEvent(
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
  const auditEvent: AuditEvent<unknown, unknown> = {
    user: buildAuditUser(session),
    ...buildBaseAuditEvent(eventName, componentId),
    ...additionalContext,
  };

  const response = await sqsClient.send(
    new SendMessageCommand({
      QueueUrl: queueUrl,
      MessageBody: JSON.stringify(auditEvent),
    }),
  );

  logger.info(
    `Successfully fired ${eventName} event - SQS message id: '${response.MessageId}'; response code: ${response.$metadata?.httpStatusCode}`,
  );
}
