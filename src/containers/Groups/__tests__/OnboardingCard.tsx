import React from 'react';

import {
  createThunkStore,
  testSnapshotShallow,
  renderShallow,
} from '../../../../testUtils';
import OnboardingCard, { GROUP_ONBOARDING_TYPES } from '../OnboardingCard';
import { removeGroupOnboardingCard } from '../../../actions/swipe';

jest.mock('../../../actions/swipe');

const groupOnboarding = {
  [GROUP_ONBOARDING_TYPES.celebrate]: true,
  [GROUP_ONBOARDING_TYPES.challenges]: true,
  [GROUP_ONBOARDING_TYPES.members]: true,
  [GROUP_ONBOARDING_TYPES.impact]: true,
  [GROUP_ONBOARDING_TYPES.contacts]: true,
  [GROUP_ONBOARDING_TYPES.surveys]: true,
  [GROUP_ONBOARDING_TYPES.steps]: true,
};

// @ts-ignore
removeGroupOnboardingCard.mockReturnValue({
  type: 'removed group onboarding card',
});

describe('OnboardingCard', () => {
  it('render celebrate card', () => {
    const store = createThunkStore({
      swipe: { groupOnboarding },
    });
    testSnapshotShallow(
      // @ts-ignore
      <OnboardingCard type={GROUP_ONBOARDING_TYPES.celebrate} />,
      store,
    );
  });

  it('render celebrate card hidden', () => {
    const store = createThunkStore({
      swipe: {
        groupOnboarding: {
          ...groupOnboarding,
          [GROUP_ONBOARDING_TYPES.celebrate]: false,
        },
      },
    });
    testSnapshotShallow(
      // @ts-ignore
      <OnboardingCard type={GROUP_ONBOARDING_TYPES.celebrate} />,
      store,
    );
  });

  it('render challenges card', () => {
    const store = createThunkStore({
      swipe: { groupOnboarding },
    });
    testSnapshotShallow(
      // @ts-ignore
      <OnboardingCard type={GROUP_ONBOARDING_TYPES.challenges} />,
      store,
    );
  });

  it('render challenges card hidden', () => {
    const store = createThunkStore({
      swipe: {
        groupOnboarding: {
          ...groupOnboarding,
          [GROUP_ONBOARDING_TYPES.challenges]: false,
        },
      },
    });
    testSnapshotShallow(
      // @ts-ignore
      <OnboardingCard type={GROUP_ONBOARDING_TYPES.challenges} />,
      store,
    );
  });

  it('render members card', () => {
    const store = createThunkStore({
      swipe: { groupOnboarding },
    });
    testSnapshotShallow(
      // @ts-ignore
      <OnboardingCard type={GROUP_ONBOARDING_TYPES.members} />,
      store,
    );
  });

  it('render members card hidden', () => {
    const store = createThunkStore({
      swipe: {
        groupOnboarding: {
          ...groupOnboarding,
          [GROUP_ONBOARDING_TYPES.members]: false,
        },
      },
    });
    testSnapshotShallow(
      // @ts-ignore
      <OnboardingCard type={GROUP_ONBOARDING_TYPES.members} />,
      store,
    );
  });

  it('render impact card', () => {
    const store = createThunkStore({
      swipe: { groupOnboarding },
    });
    testSnapshotShallow(
      // @ts-ignore
      <OnboardingCard type={GROUP_ONBOARDING_TYPES.impact} />,
      store,
    );
  });

  it('render impact card hidden', () => {
    const store = createThunkStore({
      swipe: {
        groupOnboarding: {
          ...groupOnboarding,
          [GROUP_ONBOARDING_TYPES.impact]: false,
        },
      },
    });
    testSnapshotShallow(
      // @ts-ignore
      <OnboardingCard type={GROUP_ONBOARDING_TYPES.impact} />,
      store,
    );
  });

  it('render contacts card', () => {
    const store = createThunkStore({
      swipe: { groupOnboarding },
    });
    testSnapshotShallow(
      // @ts-ignore
      <OnboardingCard type={GROUP_ONBOARDING_TYPES.contacts} />,
      store,
    );
  });

  it('render contacts card hidden', () => {
    const store = createThunkStore({
      swipe: {
        groupOnboarding: {
          ...groupOnboarding,
          [GROUP_ONBOARDING_TYPES.contacts]: false,
        },
      },
    });
    testSnapshotShallow(
      // @ts-ignore
      <OnboardingCard type={GROUP_ONBOARDING_TYPES.contacts} />,
      store,
    );
  });

  it('render surveys card', () => {
    const store = createThunkStore({
      swipe: { groupOnboarding },
    });
    testSnapshotShallow(
      // @ts-ignore
      <OnboardingCard type={GROUP_ONBOARDING_TYPES.surveys} />,
      store,
    );
  });

  it('render surveys card hidden', () => {
    const store = createThunkStore({
      swipe: {
        groupOnboarding: {
          ...groupOnboarding,
          [GROUP_ONBOARDING_TYPES.surveys]: false,
        },
      },
    });
    testSnapshotShallow(
      // @ts-ignore
      <OnboardingCard type={GROUP_ONBOARDING_TYPES.surveys} />,
      store,
    );
  });

  it('render steps card', () => {
    const store = createThunkStore({
      swipe: { groupOnboarding },
    });
    testSnapshotShallow(
      // @ts-ignore
      <OnboardingCard type={GROUP_ONBOARDING_TYPES.steps} />,
      store,
    );
  });
  it('render steps card hidden', () => {
    const store = createThunkStore({
      swipe: {
        groupOnboarding: {
          ...groupOnboarding,
          [GROUP_ONBOARDING_TYPES.steps]: false,
        },
      },
    });
    testSnapshotShallow(
      // @ts-ignore
      <OnboardingCard type={GROUP_ONBOARDING_TYPES.steps} />,
      store,
    );
  });
});

it('handles press event from the close button', () => {
  const store = createThunkStore({
    swipe: { groupOnboarding },
  });
  const component = renderShallow(
    // @ts-ignore
    <OnboardingCard type={GROUP_ONBOARDING_TYPES.celebrate} />,
    store,
  );
  component
    .childAt(1)
    .childAt(0)
    .props()
    .onPress();

  expect(removeGroupOnboardingCard).toHaveBeenCalledWith(
    GROUP_ONBOARDING_TYPES.celebrate,
  );
});
