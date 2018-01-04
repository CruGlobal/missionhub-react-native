
const ENABLE_LOGS = true;
const ENABLE_WARN = false;

function getArgs(a) {
  const args = Array.from(a);
  if (args[0] && args[0] == '[object Object]') {
    args[0] = JSON.stringify(args[0]);
  }
  if (args[1] && args[1] == '[object Object]') {
    args[1] = JSON.stringify(args[1]);
  }
  return args;
}

global.LOG = function() {
  if (__DEV__) {
    const args = getArgs(arguments);
    if (ENABLE_LOGS) {
      console.log.apply(console, args);
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

global.WARN = function() {
  if (__DEV__) {
    const args = getArgs(arguments);
    if (ENABLE_WARN) {
      console.warn.apply(console, args);
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


global.APILOG = function() {
  if (__DEV__) {
    const args = getArgs(arguments);

    if (console.tron) {
      console.tron.display({
        name: 'API Call',
        value: args,
        preview: typeof args[0] === 'string' ? args[0] : 'no preview',
      });
    }
  }
};
