# @keqingrong/npm-apis (WIP)

[![npm version](https://img.shields.io/npm/v/@keqingrong/npm-apis.svg)](https://www.npmjs.com/package/@keqingrong/npm-apis)

Programmatic APIs for npm

## Installation

```bash
# npm
npm install @keqingrong/npm-apis

# yarn
yarn add @keqingrong/npm-apis
```

## Usage

```ts
import { outdated } from '@keqingrong/npm-apis';

(async () => {
  const result = await outdated(
    {
      json: true,
      long: true
    },
    { cwd: __dirname }
  );
  const outdatedJson = JSON.parse(result);
  console.log(outdatedJson);
})();
```

## APIs

- `install(pkg?: string, config?: Partial<Config> | null, options?: SpawnOptions)`
- `outdated(config?: Partial<Config> | null, options?: SpawnOptions)`

## License

MIT © Qingrong Ke

## See Also

Official packages from the npm team:

- [libnpm](https://www.npmjs.com/package/libnpm)
- [libnpmhook](https://www.npmjs.com/package/libnpmhook)
- [libnpmexec](https://www.npmjs.com/package/libnpmexec)
- [libnpmversion](https://www.npmjs.com/package/libnpmversion)
- [libnpmaccess](https://www.npmjs.com/package/libnpmaccess)
- ...
