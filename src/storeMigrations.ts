export const migrations = {
  // Move people and global impact reports into summary key and index by personId-orgId
  // @ts-ignore
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
  // @ts-ignore
  1: state => ({
    ...state,
    swipe: {
      ...state.swipe,
      groupOnBoarding: {
        ...state.swipe.groupOnBoarding,
        steps: true,
      },
    },
  }),
  //  Move data from profile and personProfile to new onboarding reducer and remove them
  2: ({ profile = {}, personProfile = {}, ...state }) => ({
    ...state,
    onboarding: {
      ...state.onboarding,
      // @ts-ignore
      personId: personProfile.id,
      community: {
        id: '',
        community_code: '',
        community_url: '',
        // @ts-ignore
        ...(profile.community || {}),
      },
      // @ts-ignore
      skippedAddingPerson: personProfile.hasCompletedOnboarding,
    },
  }),
};
