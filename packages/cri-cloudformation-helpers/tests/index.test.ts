import { beforeEach, describe, expect, it, vi } from "vitest";
import { stackOutputs } from "../src/index";

const { mockSend } = vi.hoisted(() => ({ mockSend: vi.fn() }));

vi.mock("@aws-sdk/client-cloudformation", () => ({
  CloudFormationClient: class {
    send = mockSend;
  },
  DescribeStacksCommand: vi.fn(),
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
    mockSend.mockResolvedValueOnce({
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

  it("should return an empty if `Outputs` is empty", async () => {
    mockSend.mockResolvedValueOnce({
      Stacks: [{ Outputs: [] }],
    });

    const result = await stackOutputs("my-stack");

    expect(result).toEqual({});
  });

  it("should return an empty if `Stacks` is empty", async () => {
    mockSend.mockResolvedValueOnce({
      Stacks: [],
    });

    const result = await stackOutputs("my-stack");

    expect(result).toEqual({});
  });
});
