import uuidv4 from 'uuid/v4';
import i18next from 'i18next';

import { CUSTOM_STEP_TYPE } from '../constants';

export function buildCustomStep(text, self_step) {
  return {
    body: text,
    locale: i18next.language,
    challenge_type: CUSTOM_STEP_TYPE,
    self_step,
  };
}
