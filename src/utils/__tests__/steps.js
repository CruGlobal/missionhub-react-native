import uuidv4 from 'uuid/v4';
import i18next from 'i18next';

import { CUSTOM_STEP_TYPE } from '../../constants';
import { buildCustomStep } from '../steps';

jest.mock('uuid/v4');
jest.mock('i18next');

const text = 'roge rules';
const self_step = true;
const id = 'f6c41d33-a507-49c4-bc12-34d0dad028bd';
const locale = 'es';

uuidv4.mockReturnValue(id);
i18next.language = locale;

describe('buildCustomStep', () => {
  it('creates a custom step', () => {
    expect(buildCustomStep(text, self_step)).toEqual({
      id,
      body: text,
      selected: true,
      locale,
      challenge_type: CUSTOM_STEP_TYPE,
      self_step,
    });
  });
});
