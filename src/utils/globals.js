
const ENABLE_LOGS = true;

global.LOG = function() {
  // const args = Array.prototype.slice.call(arguments); // ES5
  // const args = Array.from(arguments); // ES6
  if (__DEV__) {
    const args = Array.from(arguments); // ES6
    // Make sure there's not object strings
    if (args[0] && args[0] == '[object Object]') {
      args[0] = JSON.stringify(args[0]);
    }
    if (args[1] && args[1] == '[object Object]') {
      args[1] = JSON.stringify(args[1]);
    }

    if (ENABLE_LOGS) {
      console.warn.apply(console, args);
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
