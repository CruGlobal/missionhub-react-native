import swipe from '../../src/reducers/swipe';
import {
  SWIPE_REMINDER_STEPS_HOME,
  SWIPE_REMINDER_STEPS_CONTACT,
  SWIPE_REMINDER_STEPS_REMINDER,
  SWIPE_REMINDER_JOURNEY,
  GROUP_ONBOARDING_CARD,
} from '../../src/constants';
import { GROUP_ONBOARDING_TYPES } from '../../src/containers/Groups/OnboardingCard';

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
