import type { AttributeValue } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { signedFetch } from "./fetch-helper.js";

export interface AuditEventRecord {
  partitionKey: string;
  sortKey: string;
  expiryDate: number;
  event: Record<string, unknown>;
}

type RawDynamoDBItem = Record<string, AttributeValue>;

interface UnmarshalledAuditItem {
  partitionKey: string;
  sortKey: string;
  expiryDate: number | string;
  event: string | Record<string, unknown>;
}

export const wait = (seconds: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, seconds * 1000));

export async function pollTestHarnessForEvents(
  baseUrl: string,
  eventName: string,
  sessionId: string,
  timeoutMs = 30000,
  pollIntervalSeconds = 0.25,
): Promise<AuditEventRecord[]> {
  const partitionKeyQuery = `SESSION#${sessionId}`;
  const sortKeyQuery = `TXMA#${eventName}`;

  const url =
    `${baseUrl}events?partitionKey=${encodeURIComponent(partitionKeyQuery)}` +
    `&sortKey=${encodeURIComponent(sortKeyQuery)}`;

  const stopTime = Date.now() + timeoutMs;

  while (Date.now() < stopTime) {
    const res = await signedFetch(url);
    await wait(pollIntervalSeconds);

    if (!res.ok) {
      throw new Error(`Events response returned the status: ${res.statusText}`);
    }

    const body = await res.json();

    if (!Array.isArray(body) || body.length === 0) {
      throw new Error(`Body response returned: ${JSON.stringify(body)}`);
    }

    const rawItems = body as RawDynamoDBItem[];

    const unmarshalledItems: UnmarshalledAuditItem[] = rawItems.map(
      (item) => unmarshall(item) as UnmarshalledAuditItem,
    );

    const records: AuditEventRecord[] = unmarshalledItems.map((item): AuditEventRecord => {
      const expiryDateNumber = typeof item.expiryDate === "string" ? Number(item.expiryDate) : item.expiryDate;

      const eventObject: Record<string, unknown> =
        typeof item.event === "string" ? (JSON.parse(item.event) as Record<string, unknown>) : (item.event ?? {});

      return {
        partitionKey: item.partitionKey,
        sortKey: item.sortKey,
        expiryDate: expiryDateNumber,
        event: eventObject,
      };
    });

    if (records.length > 0) {
      return records;
    }
  }

  throw new Error(`Timed out waiting for events for sessionId=${sessionId}, eventName=${eventName}`);
}
