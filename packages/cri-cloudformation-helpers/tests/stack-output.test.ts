import { beforeEach, describe, expect, it, vi } from "vitest";
import { stackOutputs } from "../src/stack-output";

const { mockSendCommand } = vi.hoisted(() => ({
  mockSendCommand: vi.fn(),
}));

vi.mock("../src/aws-helper.js", () => ({
  createSendCommand: vi.fn(() => mockSendCommand),
}));

describe("stackOutputs", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should throw error if stackName is not provided", async () => {
    await expect(stackOutputs()).rejects.toThrow("Stack name not provided.");
  });

  it("should throw error if stackName is empty string", async () => {
    await expect(stackOutputs("")).rejects.toThrow("Stack name not provided.");
  });

  it("should return the stack outputs", async () => {
    mockSendCommand.mockResolvedValueOnce({
      Stacks: [
        {
          Outputs: [
            { OutputKey: "stackName", OutputValue: "example-stack" },
            { OutputKey: "exampleApiUrl", OutputValue: "https://api.example.com" },
          ],
        },
      ],
    });

    const result = await stackOutputs("my-stack");

    expect(result).toEqual({
      stackName: "example-stack",
      exampleApiUrl: "https://api.example.com",
    });
  });

  it("should call sendCommand with the correct stack name", async () => {
    mockSendCommand.mockResolvedValueOnce({
      Stacks: [{ Outputs: [] }],
    });

    await stackOutputs("my-stack");

    expect(mockSendCommand).toHaveBeenCalledWith(expect.anything(), { StackName: "my-stack" });
  });
});
