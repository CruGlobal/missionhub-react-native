/*eslint no-console: 0 */

const ENABLE_LOGS = true;
const ENABLE_WARN = false;

function getArgs(a, stringify = false) {
  const args = Array.from(a);
  if (stringify && args[0] && args[0] == '[object Object]') {
    args[0] = JSON.stringify(args[0]);
  }
  if (stringify && args[1] && args[1] == '[object Object]') {
    args[1] = JSON.stringify(args[1]);
  }
  return args;
}

export const LOG = (...originalArgs) => {
  if (__DEV__) {
    const args = getArgs(originalArgs);
    if (ENABLE_LOGS) {
      console.log(...args);
    }

    if (console.tron) {
      console.tron.display({
        name: 'Console',
        value: args,
        preview: typeof args[0] === 'string' ? args[0] : 'no preview',
      });
    }
  }
};

export const WARN = (...originalArgs) => {
  if (__DEV__) {
    const args = getArgs(originalArgs, true);
    if (ENABLE_WARN) {
      console.warn(...args);
    }

    if (console.tron) {
      console.tron.display({
        name: 'Console WARN',
        value: args,
        preview: typeof args[0] === 'string' ? args[0] : 'no preview',
      });
    }
  }
};

export const APILOG = (...originalArgs) => {
  if (__DEV__) {
    const args = getArgs(originalArgs);

    if (console.tron) {
      console.tron.display({
        name: 'API Call',
        value: args,
        preview: typeof args[0] === 'string' ? args[0] : 'no preview',
      });
    }
  }
};
