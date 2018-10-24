export const nextFlow = flow => (screen, options = {}) => {
  const { skipHistory = false, backAction = () => {} } = options;
  return {
    flow,
    screen,
    skipHistory,
    backAction,
  };
};
