import { SpawnOptions } from 'child_process';
import { spawnAsync } from '../spawn';
import { npm } from '../variables';

/**
 * <https://docs.npmjs.com/cli/v7/commands/npm-version#configuration>
 */
interface Config {
  /**
   * Prevents throwing an error when `npm version` is used to set the new
   * version to the same value as the current version.
   */
  allowSameVersion: boolean;
  /** Run git commit hooks when using the `npm version` command. */
  commitHooks: boolean;
  /** Tag the commit when using the `npm version` command. */
  gitTagVersion: boolean;
  /** Whether or not to output JSON data, rather than the normal output. */
  json: boolean;
  /**
   * The "prerelease identifier" to use as a prefix for the "prerelease"
   * part of a semver. Like the `rc` in `1.2.0-rc.8`.
   */
  preid: string;
  /**
   * If set to true, then the `npm version` command will tag the version
   * using `-s` to add a signature.
   */
  signGitTag: boolean;
  /**
   * Enable running a command in the context of the configured workspaces
   * of the current project while filtering by running only the workspaces
   * defined by this configuration option.
   */
  workspace: string;
  /**
   * Enable running a command in the context of all the configured workspaces.
   */
  workspaces: boolean;
}

type ConfigName = keyof Config;

type ReleaseType =
  | 'major'
  | 'minor'
  | 'patch'
  | 'premajor'
  | 'preminor'
  | 'prepatch'
  | 'prerelease';
type NewVersionType =
  | `${number}.${number}.${number}`
  | `${number}.${number}.${number}-${number}`
  | `${number}.${number}.${number}-${string}.${number}`;

/**
 * Bump a package version
 * See <https://docs.npmjs.com/cli/v7/commands/npm-version>
 * @example
 * npm.version();
 * npm.version('2.0.0');
 * npm.version('major');
 * npm.version('prerelease');
 * npm.version('prerelease', { preid: 'beta' });
 */
export async function version<T = SpawnOptions>(
  release?: ReleaseType | NewVersionType,
  config?: Partial<Config> | null,
  options?: T
) {
  const args: string[] = ['version'];

  if (release) {
    args.push(release);
  }

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

  return spawnAsync(npm, args, options);
}
