/**
 * Makes a special 'branded' version of an otherwise generic primitive type, using an imaginary 'brand' property.
 *
 * For example, branding could be used to create a type for a UUID, an ISO8601 date string, or a Unix timestamp, without
 * losing the properties of the underlying primitive type (string or number).
 *
 * Functions that expect, eg, a ISO8601 timestamp will then fail type checks if passed a string without the correct
 * branding.
 *
 * More information: https://www.learningtypescript.com/articles/branded-types
 *
 * The caveat is that you may need to use 'as' assertions to explicitly specify that something is the correct type when
 * defining it or using it for the first time. For example:
 *
 * @example
 *   const myTimestamp = 999999 as UnixSecondsTimestamp;
 */
export type Brand<T, Name extends string> = T & {
  ___brand___: Name;
};

export type UnixMillisecondsTimestamp = Brand<number, "UnixMillisecondsTimestamp">;
export type UnixSecondsTimestamp = Brand<number, "UnixSecondsTimestamp">;

export type ISO8601DateString = Brand<string, "ISO8601DateString">;
