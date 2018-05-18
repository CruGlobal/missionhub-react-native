import swipe from '../../src/reducers/swipe';
import {
  SWIPE_REMINDER_STEPS_HOME,
  SWIPE_REMINDER_STEPS_CONTACT,
  SWIPE_REMINDER_STEPS_REMINDER,
  SWIPE_REMINDER_JOURNEY,
} from '../../src/constants';

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
