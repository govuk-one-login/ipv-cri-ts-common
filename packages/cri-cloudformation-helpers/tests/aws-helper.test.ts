import { beforeEach, describe, expect, it, vi } from "vitest";
import { createSendCommand, createSendCommandWithClient } from "../src/aws-helper.js";

const mockSend = vi.fn();

const mockClient = { send: mockSend };

class MockCommand {
  input: unknown;
  constructor(input: unknown) {
    this.input = input;
  }
}

describe("createSendCommandWithClient", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return something from client.send method", async () => {
    const expected = { Items: [{ id: "abc" }] };
    mockSend.mockResolvedValueOnce(expected);

    const sendCommand = createSendCommandWithClient(
      mockClient as unknown as Parameters<typeof createSendCommandWithClient>[0],
    );
    const result = await sendCommand(
      MockCommand as unknown as Parameters<typeof sendCommand>[0],
      {} as unknown as Parameters<typeof sendCommand>[1],
    );

    expect(result).toEqual(expected);
  });
});

describe("createSendCommand", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return the stack name when going through sendCommand function", async () => {
    const expected = { StackName: "my-stack" };
    mockSend.mockResolvedValueOnce(expected);

    const clientConstructor = vi.fn().mockReturnValue(mockClient);
    const sendCommand = createSendCommand(clientConstructor as unknown as Parameters<typeof createSendCommand>[0]);
    const result = await sendCommand(
      MockCommand as unknown as Parameters<typeof sendCommand>[0],
      {} as unknown as Parameters<typeof sendCommand>[1],
    );

    expect(result).toEqual(expected);
    expect(mockSend).toHaveBeenCalledOnce();
  });
});
