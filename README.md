# ESM-ify paths

Rewrites relative paths in import and export statements to be fully qualified.

## Why?
It has turned out to be quite tricky to write valid esm code with TS due to the requirement of
fully qualified filenames.

With this tool you continue writing TS like you always have--without specifying file extension in import and
export paths.

## How
Regardless of tooling, assume a structure similar to this:
```
app/
├─ dist/
│  ├─ cjs/
│  │  ├─ index.js
│  │  ├─ ...
│  ├─ esm/
│  │  ├─ index.js
│  │  ├─ ...
```

Because both `cjs` and `esm` have the same file extensions (`.js`) one of them needs an `package.json` to
override the root's `package.json#module`.

If the root is commonjs, add this `package.json` in `dist/esm`.
```
{
  "type": "module"
}
```

Now you're ready to run `esmify-paths` on `dist/esm`, which will make sure all relative paths in js files have
an `.js` extension.

Under the hood it uses `require.resolve` which means it's also able to resolve imports to directories (by appending
`/index.js`).

## Usage CLI

`npx esmify-paths [options] input1 input2...`

### Flags

  - `--dry`: dry run. Default `false`.
  - `--verbose`: verbose output, possibly useful when debugging. Default `false`.

## Usage node
```js
import { esmify } from 'esmify-paths';

// inputs: string[]
// options?: { dry?: boolean; verbose?: boolean; }
const result = await esmify(inputs, options);
```
