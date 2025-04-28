# Contributing

When contributing to this repository, please first discuss the change you wish to make via issue,
email, or any other method with the owners of this repository before making a change. 

Please note we have a code of conduct, please follow it in all your interactions with the project.

# Contributing to Echo
We love your input! We want to make contributing to this project as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

## We Develop with Github
We use github to host code, to track issues and feature requests, as well as accept pull requests.

## We Use [Github Actions](https://docs.github.com/en/actions), So All Code Changes Happen Through Pull Requests
Pull requests are the best way to propose changes to the codebase (we use [Github Actions](https://docs.github.com/en/actions)). We actively welcome your pull requests:

1. Fork the repo and create your branch from `master`.
2. If you've added code that should be tested, add tests.
3. If you've changed APIs, update the documentation.
4. Ensure the test suite passes.
5. Make sure your code lints.
6. Issue that pull request!

## Any contributions you make will be under the GNU General Public License v3.0
In short, when you submit code changes, your submissions are understood to be under the same [GNU GPL v3.0 License](https://choosealicense.com/licenses/gpl-3.0/) that covers the project. Feel free to contact the maintainers if that's a concern.


## Pull Request Process

1. Search GitHub for an open or closed PR that relates to your submission. You don't want to 
   duplicate effort.
2. Ensure any install or build dependencies are removed before the end of the layer when doing a 
   build.
3. Update the README.md with details of changes to the interface, this includes new environment 
   variables, exposed ports, useful file locations and container parameters.
4. Increase the version numbers in any examples files and the README.md to the new version that this
   Pull Request would represent. The versioning scheme we use is [SemVer](http://semver.org/).
5. You may merge the Pull Request in once you have the sign-off of two other developers, or if you 
   do not have permission to do that, you may request the second reviewer to merge it for you.
6. Follow the standard GitHub approach to create the PR. Please also follow our commit message format.

## Commit Message Format
Please follow the Conventional Commits specification for the commit message format. In summary, each commit message consists of a header, a body and a footer, separated by a single blank line.
```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

Any line of the commit message cannot be longer than 88 characters! This allows the message to be easier to read on GitHub as well as in various Git tools.

### Type
Must be one of the following (based on the Angular convention):
* feat: A new feature
* fix: A bug fix
* refactor: A code change that neither fixes a bug nor adds a feature
* docs: Documentation only changes
* test: Adding missing tests or correcting existing tests
* perf: A code change that improves performance
* style: Changes that do not affect the meaning of the code (whitespace, formatting, missing semicolons, etc.)
* build: Changes that affect the build system or external dependencies
* ci: Changes to our CI configuration files and scripts
A scope may be provided to a commit's type, to provide additional contextual information and is contained within parenthesis, e.g.,
```
feat(parser): add ability to parse arrays
```

### Description
Each commit must contain a succinct description of the change:
* use the imperative, present tense: "change" not "changed" nor "changes"
* don't capitalize the first letter
* no dot(.) at the end

### Body
Just as in the description, use the imperative, present tense: "change" not "changed" nor "changes". The body should include the motivation for the change and contrast this with previous behavior.

### Footer
The footer should contain any information about Breaking Changes, and is also the place to reference GitHub issues that this commit Closes.

Breaking Changes should start with the words `BREAKING CHANGE`: with a space or two new lines. The rest of the commit message is then used for this.

### Revert
If the commit reverts a previous commit, it should begin with `revert`:, followed by the description. In the body it should say: `Refs: <hash1> <hash2> ...`, where the hashs are the SHA of the commits being reverted, e.g.
```
revert: let us never again speak of the noodle incident

Refs: 676104e, a215868
```
