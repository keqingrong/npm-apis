import { spawn, SpawnOptions } from 'child_process';
import { npm } from '../variables';

/**
 * <https://docs.npmjs.com/cli/v7/commands/npm-outdated#configuration>
 */
interface Config {
  /** Show information in JSON format */
  json: boolean;
  /** Show extended information */
  long: boolean;
  /** Show parseable output instead of tree view */
  parseable: boolean;
  /**
   * Check packages in the global install prefix instead of in the current
   * project
   */
  global: boolean;
  /** Display all outdated dependencies on the tree */
  all: boolean;
}

type ConfigName = keyof Config;

/**
 * Check for outdated packages
 * See <https://docs.npmjs.com/cli/v7/commands/npm-outdated>
 * @example
 * npm.outdated();
 * npm outdated({ json: true });
 */
export async function outdated<T = SpawnOptions>(
  config?: Partial<Config> | null,
  options?: T
) {
  const args: string[] = ['outdated'];

  if (config) {
    const keys = Object.keys(config) as ConfigName[];
    if (keys.length > 0) {
      keys.forEach(key => {
        if (config[key]) {
          args.push(`--${key}`);
        }
      });
    }
  }

  return new Promise<string>((resolve, reject) => {
    const outdated = spawn(npm, args, options);

    outdated.stdout.on('data', data => {
      resolve(data.toString());
    });

    outdated.stderr.on('data', data => {
      reject(new Error(data.toString()));
    });
  });
}
