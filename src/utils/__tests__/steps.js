import i18next from 'i18next';

import { CUSTOM_STEP_TYPE } from '../../constants';
import { buildCustomStep } from '../steps';

jest.mock('i18next');

const text = 'roge rules';
const self_step = true;
const locale = 'es';

i18next.language = locale;

describe('buildCustomStep', () => {
  it('creates a custom step', () => {
    expect(buildCustomStep(text, self_step)).toEqual({
      body: text,
      locale,
      challenge_type: CUSTOM_STEP_TYPE,
      self_step,
    });
  });
});
