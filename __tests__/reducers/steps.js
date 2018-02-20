import steps from '../../src/reducers/steps';
import { COMPLETED_STEP_COUNT, FILTERED_CHALLENGES } from '../../src/constants';

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

it('saves filtered challenges', () => {
  const suggestedForMe = [ 'these are the steps for me' ];
  const suggestedForOthers = [ 'these are the steps for others' ];

  const state = steps(
    {},
    {
      type: FILTERED_CHALLENGES,
      suggestedForMe,
      suggestedForOthers,
    }
  );

  expect(state.suggestedForMe).toEqual(suggestedForMe);
  expect(state.suggestedForOthers).toEqual(suggestedForOthers);
});
