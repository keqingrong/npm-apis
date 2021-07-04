/**
 * https://github.com/npm/run-script/blob/master/lib/set-path.js
 */
import { resolve, dirname } from 'path';

const isWindows = process.platform === 'win32';
// the path here is relative, even though it does not need to be
// in order to make the posix tests pass in windows

// Windows typically calls its PATH environ 'Path', but this is not
// guaranteed, nor is it guaranteed to be the only one.  Merge them
// all together in the order they appear in the object.
const setPATH = (projectPath: string, env: Record<string, any>) => {
  // not require('path').delimiter, because we fake this for testing
  const delimiter = isWindows ? ';' : ':';
  const PATH = Object.keys(env)
    .filter(p => /^path$/i.test(p) && env[p])
    .map(p => env[p].split(delimiter))
    .reduce<string[]>(
      (set, p: string[]) => set.concat(p.filter(p => !set.includes(p))),
      []
    )
    .join(delimiter);

  const pathArr: string[] = [];
  // unshift the ./node_modules/.bin from every folder
  // walk up until dirname() does nothing, at the root
  // XXX should we specify a cwd that we don't go above?
  let p = projectPath;
  let pp: string;
  do {
    pathArr.push(resolve(p, 'node_modules', '.bin'));
    pp = p;
    p = dirname(p);
  } while (p !== pp);
  pathArr.push(PATH);

  const pathVal = pathArr.join(delimiter);

  // XXX include the node-gyp-bin path somehow?  Probably better for
  // npm or arborist or whoever to just provide that by putting it in
  // the PATH environ, since that's preserved anyway.
  for (const key of Object.keys(env)) {
    if (/^path$/i.test(key)) env[key] = pathVal;
  }

  return env;
};

export { setPATH };
