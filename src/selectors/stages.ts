import { createSelector } from 'reselect';

import { Stage, StagesState } from '../reducers/stages';

import i18next = require('i18next');

export const stageSelector = createSelector(
  ({ stages: { stages } }: { stages: StagesState }) => stages,
  (_: { stages: StagesState }, { stageId }: { stageId: string }) => stageId,
  (stages: Stage[], stageId) => stages.find(({ id }) => id === stageId),
);

export const localizedStageSelector = createSelector(
  (stage: Stage | undefined) => stage || { localized_pathway_stages: [] },
  () => i18next.language,
  (stage: Stage | { localized_pathway_stages: never[] }, appLanguage: string) =>
    stage.localized_pathway_stages.find(
      ({ locale }) => locale === appLanguage,
    ) ||
    stage.localized_pathway_stages.find(
      ({ locale }) => locale.split('-')[0] === appLanguage,
    ) || {
      locale: '',
      name: '',
      description: '',
      self_followup_description: '',
    },
);
