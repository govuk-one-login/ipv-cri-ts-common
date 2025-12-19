import { marshall } from "@aws-sdk/util-dynamodb";
import { describe, expect, it, vi } from "vitest";
import * as fetchHelper from "../src/fetch-helper";
import { pollTestHarnessForEvents, wait } from "../src/poll-events-helper";

describe("wait()", () => {
  it("waits for the correct period", async () => {
    const start = performance.now();
    await wait(0.1);
    const waitTime = performance.now() - start;

    expect(waitTime).toBeGreaterThan(95);
    expect(waitTime).toBeLessThan(125);
  });
});

describe("pollTestHarnessForEvents()", () => {
  const mockEvent = { partitionKey: "go", sortKey: "yes", expiryDate: 9, event: {} };

  const mockResponse = {
    ok: true,
    json: async () => [marshall(mockEvent)],
  } as Response;

  const nullResponse = {
    ok: true,
    json: async () => null,
  } as Response;

  const mockEmptyResponse = {
    ok: true,
    json: async () => [],
  } as Response;

  const mockStringResponse = {
    ok: true,
    json: async () => [marshall({ ...mockEvent, expiryDate: "10", event: `{"hello": true}` })],
  } as Response;

  const notOkResponse = {
    ok: false,
  } as Response;

  const signedFetchMock = vi.spyOn(fetchHelper, "signedFetch").mockResolvedValue(mockResponse);

  it("works correctly", async () => {
    signedFetchMock
      .mockResolvedValueOnce(mockEmptyResponse)
      .mockResolvedValueOnce(nullResponse)
      .mockResolvedValueOnce(notOkResponse);

    const events = await pollTestHarnessForEvents("https://yes.com/", "event_name", "session-id", 30000, 0);

    expect(signedFetchMock).toHaveBeenCalledWith(
      `https://yes.com/events?partitionKey=SESSION%23session-id&sortKey=TXMA%23event_name`,
    );
    expect(signedFetchMock).toHaveBeenCalledTimes(4);

    expect(events).toEqual([mockEvent]);
  });

  it("handles strings in events", async () => {
    signedFetchMock.mockResolvedValueOnce(mockStringResponse);

    const events = await pollTestHarnessForEvents("https://yes.com/", "event_name", "session-id", 30000, 0);

    expect(events).toEqual([{ ...mockEvent, expiryDate: 10, event: { hello: true } }]);
  });

  it("bubbles errors up to the caller", async () => {
    signedFetchMock.mockRejectedValueOnce("broken!");

    await expect(
      async () => await pollTestHarnessForEvents("https://yes.com/", "event_name", "session-id", 30000, 0),
    ).rejects.toThrow("broken!");
  });

  it("throws an error if it fails to retrieve events in the given time", async () => {
    signedFetchMock.mockResolvedValue(notOkResponse);

    await expect(
      async () => await pollTestHarnessForEvents("https://yes.com/", "event_name", "session-id", 10, 0.1),
    ).rejects.toThrow(
      expect.toSatisfy(
        ({ message }) =>
          message.includes("Timed out") && message.includes("event_name") && message.includes("session-id"),
      ),
    );
  });
});
