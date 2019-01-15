import * as fs from "fs-extra";
import * as path from "path";
import * as glob from "fast-glob";

// https://docs.npmjs.com/files/package.json#files
const include = [
  "README*",
  "CHANGES*",
  "CHANGELOG*",
  "HISTORY*",
  "LICENSE*",
  "LICENCE*",
  "NOTICE*"
];

export default async function handler({ clean, dir, force }: Yargs) {
  dir = path.relative(process.cwd(), dir);
  await fs.ensureDir(dir);
  const files: string[] = await glob.async(include, {
    case: false,
    onlyFiles: true,
    stats: false
  });

  if (!clean) {
    // Copy files
    const copyOperations = [];
    for (const file of ["package.json", ...files]) {
      copyOperations.push(
        fs.copy(file, `${dir}/${file}`, {
          errorOnExist: true,
          overwrite: force
        })
      );
    }
    await Promise.all(copyOperations);
  } else {
    // Remove files
    const rmOperations = [];
    for (const file of ["package.json", ...files]) {
      rmOperations.push(fs.remove(`${dir}/${file}`));
    }
    await Promise.all(rmOperations);
  }
}
