const { resolve } = require('path');
const { readdir, readFile, rename } = require('fs').promises;
const util = require('util');
const exec = util.promisify(require('child_process').exec);

async function* getFiles(dir) {
  const dirents = await readdir(dir, { withFileTypes: true });
  for (const dirent of dirents) {
    const res = resolve(dir, dirent.name);
    if (dirent.isDirectory()) {
      yield* getFiles(res);
    } else {
      yield res;
    }
  }
}

const renameFilesToTs = async () => {
  for await (const filename of getFiles('src')) {
    if (/\.js$/.test(filename.toString())) {
      const contents = await readFile(filename);
      const tsx = /\/>|<\//.test(contents.toString());
      const newExtension = tsx ? 'tsx' : 'ts';
      const newFilename = filename.replace('.js', `.${newExtension}`);
      rename(filename, newFilename);
    }
  }
};

const getTscOutputLines = async () => {
  try {
    return (await exec('npx tsc')).stdout.split('\n');
  } catch (e) {
    return e.stdout.split('\n');
  }
};

const addTsIgnore = tscOutputLines => {
  const allErrorLines = tscOutputLines
    .filter(line => line.includes('error TS'))
    .map(line => {
      const [filename, rest] = line.split('(');
      const [lineNum] = rest.split(',');
      return `${filename}:${lineNum}`;
    });
  const uniqueErrorLines = [...new Set(allErrorLines)];

  const lineNumsPerFile = uniqueErrorLines.reduce((acc, line) => {
    const [filename, lineNum] = line.split(':');

    const currentLineNumsInFile = acc[filename] ? acc[filename] : [];
    return {
      ...acc,
      [filename]: [
        ...(acc[filename] ? acc[filename] : []),
        Number(lineNum) + currentLineNumsInFile.length,
      ],
    };
  }, {});

  return Promise.all(
    Object.entries(lineNumsPerFile).map(async ([filename, lineNums]) => {
      for (const lineNum of lineNums) {
        await exec(
          `sed -i '' '${lineNum}i\\
// @ts-ignore\\
' ${filename}`,
        );
      }
    }),
  );
};

(async () => {
  console.log('Renaming files to .ts or .tsx...');
  await renameFilesToTs();

  console.log('Running tsc to get lint errors...');
  const tscOutputLines = await getTscOutputLines();

  console.log('Adding @ts-ignore before lint errors...');
  await addTsIgnore(tscOutputLines);

  console.log('Done.');
})();
