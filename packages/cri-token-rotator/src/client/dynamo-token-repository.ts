import type { TokenEntity } from "../model/token-entity.js";
import type { TokenRepository } from "../model/token-repository.js";

import { type DynamoDBDocumentClient, GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";

export interface DynamoTokenRepositoryConfig {
  tableName: string;
}

export const createDynamoTokenRepository = (
  config: DynamoTokenRepositoryConfig,
  client: DynamoDBDocumentClient,
): TokenRepository => ({
  getToken: async (profile) => {
    const { Item } = await client.send(new GetCommand({ Key: { id: profile }, TableName: config.tableName }));
    return Item as TokenEntity | undefined;
  },
  putToken: async (entity) => {
    await client.send(new PutCommand({ Item: entity, TableName: config.tableName }));
  },
});
