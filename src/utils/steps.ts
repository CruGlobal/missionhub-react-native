import i18next from 'i18next';

import { CUSTOM_STEP_TYPE } from '../constants';

// @ts-ignore
export function buildCustomStep(text, self_step) {
  return {
    body: text,
    locale: i18next.language,
    challenge_type: CUSTOM_STEP_TYPE,
    self_step,
  };
}

// @ts-ignore
export function insertName(steps, name) {
  // @ts-ignore
  return steps.map(step => {
    return {
      ...step,
      body: step.body.replace('<<name>>', name),
      description_markdown: (step.description_markdown || '').replace(
        /<<name>>/g,
        name,
      ),
    };
  });
}
