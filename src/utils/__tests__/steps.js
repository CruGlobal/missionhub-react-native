import i18next from 'i18next';

import { CUSTOM_STEP_TYPE } from '../../constants';
import { buildCustomStep, insertName } from '../steps';

jest.mock('i18next');

const text = 'roge rules';
const self_step = true;
const locale = 'es';

const step1 = { id: '1', body: 'blah <<name>> blah blah' };
const step2 = { id: '2', body: '<<name>> hello world' };

const name = 'roge';

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

describe('insertName', () => {
  it('inserts name', () => {
    expect(insertName([step1, step2], name)).toEqual([
      { ...step1, body: step1.body.replace('<<name>>', name) },
      { ...step2, body: step2.body.replace('<<name>>', name) },
    ]);
  });
});
