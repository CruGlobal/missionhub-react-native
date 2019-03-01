import uuidv4 from 'uuid/v4';
import i18next from 'i18next';

import { CUSTOM_STEP_TYPE } from '../constants';

//todo maybe put somewhere else since it doesn't create an action?
export function buildCustomStep(text, self_step) {
  return {
    id: uuidv4(), //todo need?
    body: text,
    selected: true, //todo need?
    locale: i18next.language,
    challenge_type: CUSTOM_STEP_TYPE,
    self_step,
  };
}
