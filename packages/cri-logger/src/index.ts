import { Logger } from "@aws-lambda-powertools/logger";

export const logger = new Logger();
export { injectLambdaContext } from "@aws-lambda-powertools/logger/middleware";
