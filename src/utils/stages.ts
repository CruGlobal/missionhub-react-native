import i18next from 'i18next';

import { Stage } from '../reducers/stages';

import { isObject } from './common';

export function getLocalizedStages(stages: Stage[]) {
  return (stages || []).map(s => {
    const localizedStages = (s.localized_pathway_stages || []).filter(
      ls => ls && isObject(ls),
    );
    const localizedStage =
      localizedStages.find(ls => ls.locale === i18next.language) ||
      localizedStages.find(ls => ls.locale.split('-')[0] === i18next.language);

    if (localizedStage) {
      const {
        name,
        description,
        self_followup_description,
        locale,
      } = localizedStage;

      return { ...s, name, description, self_followup_description, locale };
    }
    return s;
  });
}
