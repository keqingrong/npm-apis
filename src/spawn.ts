import { Buffer } from 'buffer';
import { SpawnOptions, spawn } from 'child_process';

type DataType = Buffer | string;

const isBufferList = (data: DataType[]): data is Buffer[] =>
  data.length > 0 && Buffer.isBuffer(data[0]);

/**
 * Promisified `spawn`
 *
 * - https://nodejs.org/api/child_process.html#child_process_child_process_spawn_command_args_options
 * - https://nodejs.org/api/stream.html#stream_event_data
 * - https://nodejs.org/api/stream.html#stream_readable_setencoding_encoding
 */
export const spawnAsync = (
  command: string,
  args: string[] = [],
  options: SpawnOptions = {}
) => {
  return new Promise<DataType | void>((resolve, reject) => {
    const subprocess = spawn(command, args, {
      ...options
    });

    const stdoutChunks: DataType[] = [];
    const stderrChunks: DataType[] = [];

    subprocess.stdout?.on('data', (data: DataType) => {
      stdoutChunks.push(data);
    });

    subprocess.stderr?.on('data', (data: DataType) => {
      stderrChunks.push(data);
    });

    subprocess.on('error', err => {
      reject(err);
    });

    subprocess.on('close', (code, signal) => {
      if (code || signal) {
        reject(new Error(`Exit with error code or signal: ${code || signal}`));
      } else {
        if (stderrChunks.length > 0) {
          const err = isBufferList(stderrChunks)
            ? Buffer.concat(stderrChunks)
            : stderrChunks.join('');
          reject(new Error(err.toString()));
        } else if (stdoutChunks.length > 0) {
          const out = isBufferList(stdoutChunks)
            ? Buffer.concat(stdoutChunks)
            : stdoutChunks.join('');
          resolve(out);
        } else {
          resolve(undefined);
        }
      }
    });
  });
};

/**
 * Promisified `spawn`
 */
export const spawnAsyncSimple = (
  command: string,
  args: string[] = [],
  options: SpawnOptions = {}
) => {
  return new Promise<void>((resolve, reject) => {
    const subprocess = spawn(command, args, {
      stdio: 'inherit',
      ...options
    });

    subprocess.on('error', err => {
      reject(err);
    });

    subprocess.on('close', (code, signal) => {
      if (code || signal) {
        reject(new Error(`Exit with error code or signal: ${code || signal}`));
      } else {
        resolve(undefined);
      }
    });
  });
};
