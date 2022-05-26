import fs from 'node:fs/promises';
import { esmify } from '../esmify';

test('single file', async () => {
    const output = await fs.readFile('./testdata/output/index.js', 'utf8');
    const res = await esmify(['./testdata/input/index.js'], {
        dry: true,
    });

    expect(res[0].source).toBe(output);
});

test('multiple files', async () => {
    const output = await Promise.all([
        fs.readFile('./testdata/output/index.js', 'utf8'),
        fs.readFile('./testdata/output/utils.js', 'utf8'),
    ]);

    const res = await esmify([
        './testdata/input/index.js',
        './testdata/input/utils.js',
    ], {
        dry: true,
    });

    expect(output[0]).toBe(res[0].source);
    expect(output[1]).toBe(res[1].source);
});

test('dir', async () => {
    const files = await esmify([
        './testdata/input',
    ], {
        dry: true,
    });

    for await (const file of files) {
        const outputPath = file.path.replace('/input/', '/output/');
        const expected = await fs.readFile(outputPath, 'utf8');

        expect(file.source).toBe(expected);
    }
});
