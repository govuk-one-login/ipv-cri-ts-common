export type TokenCredentials = Record<string, string>;

export interface TokenCredentialsProvider<TProfile extends string = string> {
  getCredentials: (profile: TProfile) => Promise<TokenCredentials>;
}
