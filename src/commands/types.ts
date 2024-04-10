/**
 * https://docs.npmjs.com/cli/v10/using-npm/logging
 */
export interface LogLevelConfig {
  /** --loglevel */
  loglevel:
    | 'silent'
    | 'error'
    | 'warn'
    | 'notice'
    | 'http'
    | 'info'
    | 'verbose'
    | 'silly';
  /** -d */
  d: boolean;
  /** --dd */
  dd: boolean;
  /** --verbose */
  verbose: boolean;
  /** --ddd */
  ddd: boolean;
  /** -q */
  q: boolean;
  /** --quiet */
  quiet: boolean;
  /** -s */
  s: boolean;
  /** --silent */
  silent: boolean;
}
