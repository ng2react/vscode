# Change Log

All notable changes to the "ng2react" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [0.0.1] - 2023-05-07

- Initial release

## [0.0.2] - 2023-05-07

- Added `ng2react.sandbox` setting to enable testing without an OpenAI API key.
- Prevented unchecked overwriting of files.

## [0.0.3] - 2023-05-07

- Changlog added!

## [0.0.7] - 2023-05-07

- Updated documentation
- Excluded unwanted files from package

## [0.0.12] - 2023-05-08

- Fixed bug where scanning file system for files to convert might fail
- Fixed bug where sandboxMode was always on!
- Fixed bug where converson would fail if `ng2react.sourceRoot` was not set
- Added package bundling for smaller package size

## [0.1.0] - 2023-05-09

- Replaced `ng2react.sourceRoot` property with `ng2react.angularRoot` and `ng2react.reactRoot`
- Fixed default entry for `ng2react.openai.orginization`

## [1.0.1] - 2023-05-28

- Added custom prompt support
- Added test generation
- Added prompt review (after generation)
- Added ability to save response as Markdown or J/TSX
- Added ability to select target (JSX/TSX)
- Added Treeview to display all source and converted files
- Fixed numerous bugs

## [1.0.3] - 2023-06-06

- Added "Check Connection command
