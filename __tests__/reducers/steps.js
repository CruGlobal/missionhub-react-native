import steps from '../../src/reducers/steps';
import { COMPLETED_STEP_COUNT } from '../../src/constants';

it('creates a new user step count', () => {
  const state = steps(undefined, {
    type: COMPLETED_STEP_COUNT,
    userId: 1,
  });
  expect(state.userStepCount[1]).toBe(1);
});

it('increments existing user step count', () => {
  const state = steps(
    {
      userStepCount: { [1]: 1 },
    },
    {
      type: COMPLETED_STEP_COUNT,
      userId: 1,
    }
  );
  expect(state.userStepCount[1]).toBe(2);
});
