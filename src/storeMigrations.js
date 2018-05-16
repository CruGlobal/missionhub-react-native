export const migrations = {
  // Move people and global impact reports into summary key and index by personId-orgId
  0: (state) => ({
    ...state,
    impact: {
      ...state.impact,
      people: undefined,
      global: undefined,
      summary: {
        '-': state.impact.global,
        ...Object
          .keys(state.impact.people)
          .reduce((acc, key) => ({
            ...acc,
            [ `${key}-` ]: state.impact.people[ key ],
          }), {}),

      },
    },
  }),
};
