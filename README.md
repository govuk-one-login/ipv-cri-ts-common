# ipv-cri-ts-common

TypeScript shared libraries, intended to be consumed from npm by GOV.UK One Login's Credential Issuers (CRIs).

## Development

To get started, make sure you have nvm and pre-commit installed globally already.

You can then just run:

```sh
# install correct node version
nvm install

# install dependencies
npm install

# install pre-commit git hooks
pre-commit install
```

### Commit messages

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
