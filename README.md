# ipv-cri-ts-common

TypeScript shared libraries, intended to be consumed from npm by GOV.UK One Login's Credential Issuers (CRIs).

## Setting up

To get started, make sure you have nvm and pre-commit installed globally already.

You can then just run:

```sh
# install correct node version
nvm install

# install dependencies
npm install

# install pre-commit git hooks
pre-commit install

# to install the packages within the repo
npm run build
```

## Commit messages

The publishing workflow depends on [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/#summary) to
identify fixes, features and breaking changes in your work. These are then used to generate the version number for any
package(s) that you update.

That means you should prefix your commit with:

- `chore` and others for changes that don't affect the published packages (eg, updates to monorepo config or GitHub
  actions)
- `fix` for changes that make fixes to existing functionality (semver patch changes)
- `feat` for new functionality that doesn't affect any existing usage of the module (semver minor changes)
- `feat!` for new functionality that affects existing usage of the module (semver major changes)

For example:

```
chore(config): Add new build script to the repository
fix(audit): Improve audit function logging
feat(logger): Add the ability to override default config
feat!(database): Replace database service class with a set of functions
```

We have a commit message validator enabled as part of the `pre-commit` pipeline, so you should be notified if your
message doesn't match conventions.

Outside of using conventional commit prefixes, there is no prescribed commit message syntax, as long as your commit
passes the `pre-commit` validator. However, it's probably a good idea to specify a ticket number in your message if
applicable. Conventional commit recommendations indicate that this should be done with a `Refs` footer, but it can also
be included in the message header if preferred.

## Bootstrapping packages

In order to ensure consistency and make it easy to create a new package, there are two scripts to automate the process
of bootstrapping a new package.

To set up a new package directory in the repository, run:

```sh
$ npm run init-new-package
```

This will ask you for the package name and create the necessary directory, package.json and other files.

To publish v0.0.0 of your new package to npm, someone with access to the `@govuk-one-login` organisation needs to run:

```sh
$ npm run publish-v0-to-npm
```

The script will ask for the package name, authenticate with npm and publish a single package.json file containing only
the package name and version. It runs independently of the packages directory, so any code you have written for your
package already will not be affected or published.

This command must be run by someone with access to the `@govuk-one-login` organisation on npm, as only they have
permissions to publish the package. Once the package has been initialised, they should immediately set up OIDC
publishing (aka 'trusted publishing') to enable automatic secure publishing from GitHub Actions, and use the strictest
possible settings (eg, specify environment name and disable tokens).

## Dependencies

In this section:

- 'package' means a package published to npm from this repo
- 'consumer' means someone importing a package
- 'dependency' means an external dependency that's needed by a package and/or a consumer

It's important to think carefully about how we include dependencies. In many cases, we want to be certain that the
package consumer's source code is using the same package version as the package itself. This brings two benefits:

- the package consumer retains control over the version that is installed, so we can do version bumps on external
  dependencies without needing to update the packages in this repo.
- the package consumer uses the same instance of the dependency - this can be important where:
  - the dependency exports some stateful component that's used in both the package and the consumer
  - the dependency exports types that are part of the package's interface and therefore could be affected by version
    mismatches

This can be achieved using the `peerDependencies` field in the package's `package.json` manifest. Using
`peerDependencies` means the consumer is required to manually install that dependency, subject to a compatible version
range that we specify, and therefore the same package version will also be available to the consumer's code.

Examples where this technique would be useful include `@govuk-one-login/cri-logger` (which exports a stateful class
instance) and `@aws-sdk/client-*` (which is updated regularly and may be needed in the consumer code too). By contrast,
it would be preferable to just specify the dependency in the package's `dependencies` field when the dependency is
completely internal to the package, and unlikely to also be used by the consumer - for example, a JWT verifier package
that uses `jose` functions internally.

Only specifying the dependency in `peerDependencies` means the given dependency is not installed when working in this
repository. This is solved by also specifying the dependency in the root `devDependencies` field, where we can control
which version of the dependency is used for development and testing.

Specifying peer dependencies on packages can be done as follows:

- Add the current version of the dependency to the top-level `package.json`'s `devDependencies` key, with an absolute
  pinned version (ie, no `^` or `~` at the start of the version number)
- Add the dependency to the `peerDependencies` with the same version number, prefixed with a caret (`^`)

## SDK Clients

It is recommended to handle stateful SDK clients in the following way:

```ts
// service-a-client.ts
import { ServiceAClientClass } from "some-dependency";

let serviceAClient: ServiceAClientClass | undefined;

export function setServiceAClient(client: ServiceAClientClass) {
  serviceAClient = client;
}

export function getServiceAClient(): ServiceAClientClass {
  serviceAClient ??= new ServiceAClientClass({ someSensibleDefaultConfig: "goes here" });

  return serviceAClient;
}
```

```ts
// index.ts
import { getServiceAClient } from "./service-a-client.js";

export { setServiceAClient } from "./service-a-client.js";

export async function doPackageFunction() {
  await getServiceAClient().doSomethingWithTheClient();
}
```

This way, the client is lazy-evaluated and can be overridden by the consumer of your package if they choose - something
like this:

```ts
import { ServiceAClientClass } from "some-dependency";
import { setServiceAClient, doPackageFunction } from "@govuk-one-login/your-package";

const customClient = new ServiceAClientClass({ someCustomConfig: "goes here" });

setServiceAClient(customClient);

// this will now use the custom client under the hood
await doPackageFunction();
```
