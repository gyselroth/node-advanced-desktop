# Contribute to balloon desktop client
Did you find a bug or would you like to contribute a feature? You are more than welcome to do so.
Please, always file an [issue](https://github.com/gyselroth/node-advanced-desktop/issues/new) first in order to discuss the matter at hand. Please, refrain from developing without an open issue; otherwise we will not know what you are working on. 

## Bug
If you just want to file a bug report, please open your [issue](https://github.com/gyselroth/node-advanced-desktop/issues/new).
We are always eager to fix your reported bug to provide best software for the opensource community.

## Security flaw
Do not open an issue for a possible security vulnerability; in order to protect yourself and others, please always contact <opensource@gyselroth.net>
to report your concerns.

## Git
You can clone the repository from:
```
git clone https://github.com/gyselroth/node-advanced-desktop.git
```

## Git commit 
Please make sure that (within a git commit) you always specify the number of your issue starting with a hashtag (#).

## Pull Request
You are more than welcome to submit a pull request that references an open issue. Please make sure that you observe coding conventions 
and also ensure that all your modifications pass the build.
[![Build Status](https://travis-ci.org/gyselroth/node-advanced-desktop.svg)](https://travis-ci.org/gyselroth/node-advanced-desktop)

## Code of Conduct
Please note that this project is released with a [Contributor Code of Conduct](https://github.com/gyselroth/node-advanced-desktop/CODE_OF_CONDUCT.md). By participating in this project you agree to abide by its terms.

## License
This software is freely available under the terms of [MIT](https://github.com/gyselroth/node-advanced-desktop/LICENSE), please respect this license and do not contribute software which ist not compatible with MIT or is not your work.

## Editor config
This repository gets shipped with an .editorconfig configuration. For more information on how to configure your editor, please visit [editorconfig](https://github.com/editorconfig).

# Build

## Automation
All builds are triggered automatically with commits into master. Windows builds are handled by [Appvoyer](https://ci.appveyor.com/project/raffis/node-advanced-desktop) whereas OSX and Linux builds are handled by [Travis-ci](https://travis-ci.org/gyselroth/node-advanced-desktop).

## Publishing

For publishing it is required to build on OS X since we need to compile a native addon for OS X!

```
npm run compile
```

# Run tests

```
npm run test
```
