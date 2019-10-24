export const migrations = {
  // Move people and global impact reports into summary key and index by personId-orgId
  0: state => ({
    ...state,
    impact: {
      ...state.impact,
      people: undefined,
      global: undefined,
      summary: {
        '-': state.impact.global,
        ...Object.keys(state.impact.people).reduce(
          (acc, key) => ({
            ...acc,
            [`${key}-`]: state.impact.people[key],
          }),
          {},
        ),
      },
    },
  }),
  //  Move data from profile and personProfile to new onboarding reducer and remove them
  1: ({ profile = {}, personProfile = {}, ...state }) => ({
    ...state,
    onboarding: {
      ...state.onboarding,
      personId: personProfile.id,
      community: {
        id: '',
        community_code: '',
        community_url: '',
        ...(profile.community || {}),
      },
      skippedAddingPerson: personProfile.hasCompletedOnboarding,
    },
  }),
};
