/*eslint no-console: 0 */

const ENABLE_LOGS = true;
const ENABLE_WARN = false;

// @ts-ignore
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

// @ts-ignore
export const LOG = (...originalArgs) => {
  if (__DEV__) {
    const args = getArgs(originalArgs);
    if (ENABLE_LOGS) {
      console.log(...args);
    }

    // @ts-ignore
    if (console.tron) {
      // @ts-ignore
      console.tron.display({
        name: 'Console',
        value: args,
        preview: typeof args[0] === 'string' ? args[0] : 'no preview',
      });
    }
  }
};

// @ts-ignore
export const WARN = (...originalArgs) => {
  if (__DEV__) {
    const args = getArgs(originalArgs, true);
    if (ENABLE_WARN) {
      console.warn(...args);
    }

    // @ts-ignore
    if (console.tron) {
      // @ts-ignore
      console.tron.display({
        name: 'Console WARN',
        value: args,
        preview: typeof args[0] === 'string' ? args[0] : 'no preview',
      });
    }
  }
};

// @ts-ignore
export const APILOG = (...originalArgs) => {
  if (__DEV__) {
    const args = getArgs(originalArgs);

    // @ts-ignore
    if (console.tron) {
      // @ts-ignore
      console.tron.display({
        name: 'API Call',
        value: args,
        preview: typeof args[0] === 'string' ? args[0] : 'no preview',
      });
    }
  }
};
