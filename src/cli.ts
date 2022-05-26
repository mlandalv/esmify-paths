#!/usr/bin/env node

import process from 'node:process';
import { resolve, join } from 'node:path';
import { readFileSync } from 'node:fs';
import minimist from 'minimist';
import { esmify } from './esmify';

const argv = minimist(process.argv.slice(2), {
    boolean: ['dry', 'verbose', 'force', 'version', 'help'],
});

if (argv.version) {
    const content = readFileSync(join(__dirname, '../package.json'), 'utf8');
    const pkg = JSON.parse(content);
    console.log(`${pkg.name} version ${pkg.version}`);
    process.exit(0);
}

if (argv.help || !argv._.length) {
    console.log(`
Usage: esmify-paths [--version] [--help] [--dry] [--force] <pathspec>...

Options:
    <pathspec>...
        Files or directories to process. Must be within cwd unless --force is passed.

    --dry
        Don't actually modify the files, just show files that would be modified.

    --verbose
        Be verbose.

    --force
        Allow parsing of entry files outside cwd.

    --help
        Show this help.
    `);
    process.exit(argv.help ? 0 : 1);
}

const cwd = process.cwd();

if (!argv.force) {
    argv._.forEach(x => {
        const p = resolve(x);
        if (!p.startsWith(cwd)) {
            throw new Error(`Cannot process entry files outside CWD unless --force is used: ${p}`)
        }
    });
}

const start = new Date();
esmify(argv._, {
    dry: argv.dry,
}).then(files => {
    const duration = (new Date()).valueOf() - start.valueOf();
    const changedFiles = files.filter(x => x.changes.length);
    const totChanges = files.reduce((acc, f) => acc + f.changes.length, 0);

    if (argv.verbose) {
        files.forEach(x => {
            const status = x.changes.length ? 'MODIFIED' : 'SKIPPED';
            console.log(`[${status.padStart(8, ' ')}] ${x.path}`);

            x.changes.forEach(change => {
                console.log(`           ${change.original} => ${change.line}`);
            });
        });
    }

    console.log(`esmify-paths: Rewrote ${totChanges} paths in ${changedFiles.length} of ${files.length} files (${duration} ms).`);
}).catch(err => {
    console.error(err);
    process.exit(1);
});
