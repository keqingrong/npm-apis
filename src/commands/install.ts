import { spawn, SpawnOptions } from 'child_process';
import decamelize from 'decamelize';
import { npm } from '../variables';

/**
 * <https://docs.npmjs.com/cli/v7/commands/npm-install#configuration>
 */
interface Config {
  /** --tag */
  tag: string;
  /** --global */
  global: boolean;
  /** -g */
  g: boolean;
  /** --force */
  force: boolean;
  /** -f */
  f: boolean;
  /** --global-style */
  globalStyle: boolean;
  /** --legacy-bundling */
  legacyBundling: boolean;
  /** --legacy-peer-deps */
  legacyPeerDeps: boolean;
  /** --strict-peer-deps */
  strictPeerDeps: boolean;
  /** --no-package-lock */
  noPackageLock: boolean;
  /** --package-lock-only */
  packageLockOnly: boolean;
  /** --no-shrinkwrap */
  noShrinkwrap: boolean;
  /** --omit=<type> */
  omit: string;
  /** --include */
  include: string;
  /** --no-optional */
  noOptional: boolean;
  /** --prod */
  prod: boolean;
  /** --only=prod */
  only: string;
  /** --also=dev */
  also: string;
  /** --ignore-scripts */
  ignoreScripts: boolean;
  /** --no-audit */
  noAudit: boolean;
  /** --no-bin-links */
  noBinLinks: boolean;
  /** --no-fund */
  noFund: boolean;
  /** --dry-run */
  dryRun: boolean;
  /** --no-save */
  noSave: boolean;
}

type ConfigName = keyof Config;

/**
 * Install a package
 * <https://docs.npmjs.com/cli/v7/commands/npm-install>
 * @example
 * npm.install();
 * npm.install('express');
 * npm.install('eslint', { global: true });
 * npm.install('typescript', { saveDev: true });
 */
export async function install<T = SpawnOptions>(
  pkg?: string,
  config?: Partial<Config> | null,
  options?: T
) {
  const args: string[] = ['install'];

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

  return new Promise((resolve, reject) => {
    const outdated = spawn(npm, args, options);

    outdated.stdout.on('data', data => {
      resolve(data.toString());
    });

    outdated.stderr.on('data', data => {
      reject(new Error(data.toString()));
    });
  });
}

export { install as i, install as add };
