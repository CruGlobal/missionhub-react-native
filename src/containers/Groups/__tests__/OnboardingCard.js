import React from 'react';

import {
  createMockStore,
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
};

describe('OnboardingCard', () => {
  it('render celebrate card', () => {
    const store = createMockStore({
      swipe: { groupOnboarding },
    });
    testSnapshotShallow(
      <OnboardingCard type={GROUP_ONBOARDING_TYPES.celebrate} />,
      store,
    );
  });

  it('render celebrate card hidden', () => {
    const store = createMockStore({
      swipe: {
        groupOnboarding: {
          ...groupOnboarding,
          [GROUP_ONBOARDING_TYPES.celebrate]: false,
        },
      },
    });
    testSnapshotShallow(
      <OnboardingCard type={GROUP_ONBOARDING_TYPES.celebrate} />,
      store,
    );
  });

  // TODO: Enable this when the challenges are merged in
  xit('render challenges card', () => {
    const store = createMockStore({
      swipe: { groupOnboarding },
    });
    testSnapshotShallow(
      <OnboardingCard type={GROUP_ONBOARDING_TYPES.challenges} />,
      store,
    );
  });

  xit('render challenges card hidden', () => {
    const store = createMockStore({
      swipe: {
        groupOnboarding: {
          ...groupOnboarding,
          [GROUP_ONBOARDING_TYPES.challenges]: false,
        },
      },
    });
    testSnapshotShallow(
      <OnboardingCard type={GROUP_ONBOARDING_TYPES.challenges} />,
      store,
    );
  });

  it('render members card', () => {
    const store = createMockStore({
      swipe: { groupOnboarding },
    });
    testSnapshotShallow(
      <OnboardingCard type={GROUP_ONBOARDING_TYPES.members} />,
      store,
    );
  });

  it('render members card hidden', () => {
    const store = createMockStore({
      swipe: {
        groupOnboarding: {
          ...groupOnboarding,
          [GROUP_ONBOARDING_TYPES.members]: false,
        },
      },
    });
    testSnapshotShallow(
      <OnboardingCard type={GROUP_ONBOARDING_TYPES.members} />,
      store,
    );
  });

  it('render impact card', () => {
    const store = createMockStore({
      swipe: { groupOnboarding },
    });
    testSnapshotShallow(
      <OnboardingCard type={GROUP_ONBOARDING_TYPES.impact} />,
      store,
    );
  });

  it('render impact card hidden', () => {
    const store = createMockStore({
      swipe: {
        groupOnboarding: {
          ...groupOnboarding,
          [GROUP_ONBOARDING_TYPES.impact]: false,
        },
      },
    });
    testSnapshotShallow(
      <OnboardingCard type={GROUP_ONBOARDING_TYPES.impact} />,
      store,
    );
  });

  it('render contacts card', () => {
    const store = createMockStore({
      swipe: { groupOnboarding },
    });
    testSnapshotShallow(
      <OnboardingCard type={GROUP_ONBOARDING_TYPES.contacts} />,
      store,
    );
  });

  it('render contacts card hidden', () => {
    const store = createMockStore({
      swipe: {
        groupOnboarding: {
          ...groupOnboarding,
          [GROUP_ONBOARDING_TYPES.contacts]: false,
        },
      },
    });
    testSnapshotShallow(
      <OnboardingCard type={GROUP_ONBOARDING_TYPES.contacts} />,
      store,
    );
  });

  it('render surveys card', () => {
    const store = createMockStore({
      swipe: { groupOnboarding },
    });
    testSnapshotShallow(
      <OnboardingCard type={GROUP_ONBOARDING_TYPES.surveys} />,
      store,
    );
  });

  it('render surveys card hidden', () => {
    const store = createMockStore({
      swipe: {
        groupOnboarding: {
          ...groupOnboarding,
          [GROUP_ONBOARDING_TYPES.surveys]: false,
        },
      },
    });
    testSnapshotShallow(
      <OnboardingCard type={GROUP_ONBOARDING_TYPES.surveys} />,
      store,
    );
  });
});

it('handles press event from the close button', () => {
  const store = createMockStore({
    swipe: { groupOnboarding },
  });
  const component = renderShallow(
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
