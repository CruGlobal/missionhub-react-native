import { CUSTOM_STEP_TYPE } from '../../constants';
import { buildCustomStep } from '../steps';

const text = 'roge rules';
const self_step = true;

describe('buildCustomStep', () => {
  it('creates a custom step', () => {
    expect(buildCustomStep(text, self_step)).toEqual({
      id: expect.any(String),
      body: text,
      selected: true,
      locale: undefined,
      challenge_type: CUSTOM_STEP_TYPE,
      self_step,
    });
  });
});
