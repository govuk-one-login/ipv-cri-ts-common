import { Logger } from "@aws-lambda-powertools/logger";

export const logger = new Logger();

export const testLogger = (serviceName: string): Logger =>
  new Logger({ serviceName });
