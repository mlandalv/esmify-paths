import { stat, readFile, readdir, writeFile } from 'node:fs/promises';
import { dirname, join, relative, resolve } from 'node:path';

export interface Change {
    original: string;
    line: string;
}

export interface FileResult {
    path: string;
    source: string;
    changes: Change[];
}

export interface EsmifyOptions {
    dry?: boolean;
}

/**
 *
 * @param inputs {string[]}
 * @param options {{dry?: boolean; verbose?: boolean; extension?: string}}
 * @returns {Promise<void|Awaited<unknown>[]|*>}
 */
export const esmify = async (inputs: string[], options?: EsmifyOptions): Promise<FileResult[]> => {
    const {
        dry = false,
    } = options || {};
    const extension = '.js';

    /**
     *
     * @param input {string}
     * @returns {Promise<void>}
     */
    const processFile = async (input: string): Promise<FileResult> => {
        const dir = dirname(input);
        const source = await readFile(input, 'utf8');
        const changes: Change[] = [];
        const newSource = source.replace(/((from|import)\s+['"])(\..*?)(['"])/g, (match, p1, p2, p3, p4) => {
            if (!p3.startsWith('.') && !p3.endsWith(extension)) {
                return match;
            }

            const absPath = require.resolve(join(resolve(dir), p3), { paths: [] });
            let relPath = relative(dir, absPath);
            if (!relPath.startsWith('.')) {
                relPath = `./${relPath}`;
            }
            const newLine = p1 + relPath.replace(/\\/g, '/') + p4;
            if (relPath !== p3) {
                changes.push({
                    original: p3,
                    line: relPath,
                });
            }

            return newLine;
        });

        if (!dry && newSource !== source) {
            await writeFile(input, newSource, 'utf8');
        }

        return {
            path: input,
            source: newSource,
            changes,
        }
    };

    /**
     *
     * @param input {string}
     * @returns {Promise<unknown>}
     */
    const processInput = async (input: string): Promise<FileResult[]> => {
        const stats = await stat(input);

        if (stats.isFile()) {
            if (!input.endsWith(extension)) {
                return [];
            }

            return [await processFile(input)];
        } else if (stats.isDirectory()) {
            return processDir(input);
        } else {
            console.warn(`${input} is neither file nor dir; skipping.`);
        }

        return [];
    };

    /**
     *
     * @param input {string}
     * @returns {Promise<unknown>}
     */
    const processDir = async (input: string): Promise<FileResult[]> => {
        const items = await readdir(input);
        const res = await Promise.all(items.map(x => processInput(join(input, x))));

        return res.flat();
    };

    return (await Promise.all(inputs.map(processInput))).flat();
};
