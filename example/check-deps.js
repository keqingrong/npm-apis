const chalk = require('chalk');
const { outdated: npmOutdated } = require('../dist');
const log = (...args) => console.log(...args);

async function main() {
  log(`[check-deps] 开始检查项目 npm 依赖...`);
  const outdated = await npmOutdated(
    {
      json: true,
      long: true
    },
    { cwd: __dirname }
  );
  const outdatedJson = JSON.parse(outdated);
  const outdatedList = Object.keys(outdatedJson).map(name => ({
    name,
    ...outdatedJson[name]
  }));
  const missingList = outdatedList.filter(
    item => !item.hasOwnProperty('current')
  );
  const wantedList = outdatedList.filter(
    item => item.hasOwnProperty('current') && item.current !== item.wanted
  );
  const wantedList2 = wantedList.filter(({ type }) =>
    ['dependencies', 'peerDependencies'].includes(type)
  );
  if (missingList.length > 0) {
    log(`[check-deps] 以下 npm 依赖未安装：`);
    log(
      `${missingList
        .map(
          ({ name, wanted }) =>
            `${chalk.red(name)} MISSING -> ${chalk.green(wanted)}`
        )
        .join('\n')}`
    );
  } else {
    log(`[check-deps] 没有发现未安装的 npm 依赖`);
  }

  if (wantedList2.length > 0) {
    log(`[check-deps] 以下 npm 依赖需要更新：`);
    log(
      `${wantedList2
        .map(
          ({ name, wanted, current }) =>
            `${chalk.yellow(name)} ${current} -> ${chalk.green(wanted)}`
        )
        .join('\n')}`
    );
  } else {
    log(`[check-deps] 没有发现需要更新的 npm 依赖`);
  }
}

main();
