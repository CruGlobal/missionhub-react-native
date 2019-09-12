import i18n from 'i18next';

import { Stage } from '../reducers/stages';

import { isObject } from './common';

export function getLocalizedStages(stages: Stage[]) {
  return (stages || []).map(s => {
    const localizedStage = (s.localized_pathway_stages || []).find(
      ls => ls && isObject(ls) && ls.locale === i18n.language,
    );

    if (localizedStage) {
      const { name, description, self_followup_description } = localizedStage;

      return { ...s, name, description, self_followup_description };
    }
    return s;
  });
}
