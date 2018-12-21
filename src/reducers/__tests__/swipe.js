import swipe from '../swipe';
import {
  SWIPE_REMINDER_STEPS_HOME,
  SWIPE_REMINDER_STEPS_CONTACT,
  SWIPE_REMINDER_STEPS_REMINDER,
  SWIPE_REMINDER_JOURNEY,
  GROUP_ONBOARDING_CARD,
  GROUP_INVITE_INFO,
  GROUP_TAB_SCROLL_ON_MOUNT,
} from '../../constants';
import { GROUP_ONBOARDING_TYPES } from '../../containers/Groups/OnboardingCard';

it('updates swipe steps home value', () => {
  const state = swipe(
    {},
    {
      type: SWIPE_REMINDER_STEPS_HOME,
    },
  );
  expect(state.stepsHome).toBe(false);
});

it('updates swipe steps contact value', () => {
  const state = swipe(
    {},
    {
      type: SWIPE_REMINDER_STEPS_CONTACT,
    },
  );
  expect(state.stepsContact).toBe(false);
});

it('updates swipe steps reminder value', () => {
  const state = swipe(
    {},
    {
      type: SWIPE_REMINDER_STEPS_REMINDER,
    },
  );
  expect(state.stepsReminder).toBe(false);
});

it('updates swipe steps journey value', () => {
  const state = swipe(
    {},
    {
      type: SWIPE_REMINDER_JOURNEY,
    },
  );
  expect(state.journey).toBe(false);
});

it('updates group onboarding celebrate value', () => {
  const state = swipe(undefined, {
    type: GROUP_ONBOARDING_CARD,
    target: GROUP_ONBOARDING_TYPES.celebrate,
    value: false,
  });
  expect(state.groupOnboarding[GROUP_ONBOARDING_TYPES.celebrate]).toBe(false);
});

it('updates group onboarding challenges value', () => {
  const state = swipe(undefined, {
    type: GROUP_ONBOARDING_CARD,
    target: GROUP_ONBOARDING_TYPES.challenges,
    value: false,
  });
  expect(state.groupOnboarding[GROUP_ONBOARDING_TYPES.challenges]).toBe(false);
});

it('updates group onboarding members value', () => {
  const state = swipe(undefined, {
    type: GROUP_ONBOARDING_CARD,
    target: GROUP_ONBOARDING_TYPES.members,
    value: false,
  });
  expect(state.groupOnboarding[GROUP_ONBOARDING_TYPES.members]).toBe(false);
});

it('updates group onboarding impact value', () => {
  const state = swipe(undefined, {
    type: GROUP_ONBOARDING_CARD,
    target: GROUP_ONBOARDING_TYPES.impact,
    value: false,
  });
  expect(state.groupOnboarding[GROUP_ONBOARDING_TYPES.impact]).toBe(false);
});

it('updates group onboarding contacts value', () => {
  const state = swipe(undefined, {
    type: GROUP_ONBOARDING_CARD,
    target: GROUP_ONBOARDING_TYPES.contacts,
    value: false,
  });
  expect(state.groupOnboarding[GROUP_ONBOARDING_TYPES.contacts]).toBe(false);
});

it('updates group onboarding surveys value', () => {
  const state = swipe(undefined, {
    type: GROUP_ONBOARDING_CARD,
    target: GROUP_ONBOARDING_TYPES.surveys,
    value: false,
  });
  expect(state.groupOnboarding[GROUP_ONBOARDING_TYPES.surveys]).toBe(false);
});

it('doesnt update group onboarding', () => {
  const state = swipe(undefined, {
    type: GROUP_ONBOARDING_CARD,
    target: 'badtarget',
    value: false,
  });
  expect(state).toBe(state);
});

it('updates group invite info', () => {
  const state = swipe(
    {},
    {
      type: GROUP_INVITE_INFO,
    },
  );
  expect(state.groupInviteInfo).toBe(false);
});

it('updates group tab scroll to be true', () => {
  const state = swipe(
    {},
    {
      type: GROUP_TAB_SCROLL_ON_MOUNT,
      value: '123',
    },
  );
  expect(state.groupScrollToId).toBe('123');
});

it('updates group tab scroll to be false', () => {
  const state = swipe(
    {},
    {
      type: GROUP_TAB_SCROLL_ON_MOUNT,
      value: null,
    },
  );
  expect(state.groupScrollToId).toBe(null);
});
