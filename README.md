# Three JS React Boilerplate

This template is to get a Three.js project up and running in a React environment with minimal to no setup.

## How to use it

1. Clone the repository
2. Delete the git history with `rm -rf .git`
3. Change the name in the package.json file to your project name
4. Change the name in the title tag in the index.html file to your project name
5. Install the dependencies with `npm install`
6. Delete the h1 tag in App.tsx and the h1 css from styles.css

## Directory Aliases

To add a new directory alias, in tsconfig.json add a new path the same way as the `classes` directory alias. Add the alias in the .babelrc file too.

## Intended use

- `@core` should export things that can be reused across any project to setup the environment
- `@utils` should export helper functions these may or may not be specific to the project
- `@classes` should export classes that may or may not be specific to the project (e.g. a helper class to manage InstancedMesh with varying colors for each point).
- `@controllers` should be project specific, coordinating the other classes and functions to build the project.
