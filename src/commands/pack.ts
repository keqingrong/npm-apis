import { SpawnOptions } from 'child_process';
import decamelize from 'decamelize';
import { spawnAsync } from '../spawn';
import { npm } from '../variables';
import { LogLevelConfig } from './types';

/**
 * <https://docs.npmjs.com/cli/v7/commands/npm-pack#configuration>
 */
interface Config extends LogLevelConfig {
  /** --dry-run */
  dryRun: boolean;
  /** --json */
  json: boolean;
  /** --pack-destination */
  packDestination: string;
  /** workspace */
  workspace: string;
  /** workspaces */
  workspaces: boolean;
}

type ConfigName = keyof Config;

/**
 * Create a tarball from a package
 * See <https://docs.npmjs.com/cli/v7/commands/npm-pack>
 * @example
 * npm.pack();
 * npm.pack('express');
 */
export async function pack<T extends SpawnOptions>(  pkg?: string,
  config?: Partial<Config> | null,
  options?: T) {
  const args: string[] = ['pack'];

  if (pkg && pkg.length > 0) {
    args.push(pkg);
  }

  if (config) {
    const keys = Object.keys(config) as ConfigName[];
    if (keys.length > 0) {
      keys.forEach(key => {
        const value = config[key];
        const isShorthand = key.length === 1;
        const prefix = isShorthand ? '-' : '--';
        const dashedKey = isShorthand
          ? key
          : decamelize(key, { separator: '-' });
        const rest = value === true ? '' : `=${value}`;
        args.push(`${prefix}${dashedKey}${rest}`);
      });
    }
  }

  return spawnAsync(npm, args, options);
}
