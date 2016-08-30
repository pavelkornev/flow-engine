Flow Engine
===================================

Installation:
```
git clone git@github.com:pavelkornev/flow-engine.git
cd flow-engine && npm install
```

Usage:
```
./build/cli.js --rules=[filename] --tasks=[filename]
```

Examples:
```
npm run example_simple
npm run example_cycle
```

TODO:
- add friendly errors in CLI tool
- add tests for CLI tool
- optimize performance: don't recreate rules for each task