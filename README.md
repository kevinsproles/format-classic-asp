# Format Classic ASP VSCode extension

Anytime you save an .asp file, this extension will modify the formatting as follows:

1. It will camel case your code

The only code within your file that it will format is:

1. Code within `<%` and `%>`
2. Server side includes within `<!-- #include` and `-->`

## Camel Case

Being that Classic ASP is a case-insensitive language, we can make your code prettier, without breaking it.

More consistent usage of case to better enhance readability.

camelCase is the preferred naming convension of web developers primarily in javascript / typescript / nodejs. This extension brings that preferred style to Classic ASP.

## Features

- Does not remove underscores (so does not _exactly_ camelCase) so that your code does not break
- Formats entire file, rather than just single words (unlike other extensions)
- Preserves whitespace and new lines
- Preserves case sensitive parts of your file such as strings in classic asp

**Enjoy!**
