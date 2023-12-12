# t4t: Tools for TypeScript

t4t is a toolbox of commonly implemented and re-implemented utilities for
TypeScript. This includes both type and code libraries designed to make the
TypeScript experience smoother.

_The project is a work in progress. Development pace may be slow._

## Links

- [GitHub repository](https://github.com/t4t4u/t4t)
- [npm package](https://www.npmjs.com/package/t4t)
- [Documentation](https://t4t4u.github.io/t4t/)

## Project goals

1. **TypeScript first.** t4t is written in TypeScript to enhance the TypeScript
   experience. Regular JavaScript projects may find t4t useful, but it is not
   taken into account in the design process.
2. **Not just types.** t4t implements both types and code libraries.
3. **Multi-platform, not just platform agnostic.** While most libraries in t4t
   are designed to be pure and dependent only on core language features, node
   and web-specific libraries may be published under `t4t/node/*` and
   `t4t/web/*` respectively.
4. **No transitive dependencies.** Installing t4t means installing only t4t. The
   library has no runtime dependencies.
5. **Reasonably up to date.** t4t embraces new language and tooling features
   where they appear and aid its features and development. Development is done
   using the latest node LTS version. The library targets the latest node LTS
   version, but should guarantee support for the preceding LTS release for a
   transitional period of roughly one year.

## Contributing

t4t does not presently have any concrete contribution guidelines. If you want to
contribute, reach out! Post an issue! Post two! Some haphazard things to
remember:

- Be nice to and respecful of each other.
- It's better to raise discussion early rather than later so that development
  efforts can go in a direction agreed on from the start.
- The style guide is just what the linter and formatter enforces in addition to
  existing praxis.
- In the interest of maintaining quality, contributions should include tests
  with good coverage and documentation as well.

### Developing

t4t should be a fairly straightforward development experience for experienced
node developers. That said, here are some basic steps to get you started:

1. Make sure you have node 20 and npm installed.
2. Fork the repository and clone your fork.
3. Run `npm install` to install development dependencies. This will also set up
   husky, which handles git hooks that automatically runs the formatter, linter,
   and tests in various ways.
4. Make your improvements. Write tests. Write documentation.
5. File a pull request!

All handling of the project should be handled via the lifecycle scripts. See the
`scripts` field of `package.json`. The `lint`, `format`, and `test` scripts must
pass to merge.

## License

This project is distributed under the
[Mozilla Public License Version 2.0](https://www.mozilla.org/en-US/MPL/2.0/). A
plaintext version of the license should be distributed alongside this project in
the `LICENSE` file.
