import { createSelector } from 'reselect';

import { Stage, StagesState, LocalizedPathwayStage } from '../reducers/stages';

export const stageSelector = createSelector(
  ({ stages: { stages } }: { stages: StagesState }) => stages,
  (_: { stages: StagesState }, { stageId }: { stageId: string }) => stageId,
  (stages: Stage[], stageId) => stages.find(({ id }) => id === stageId),
);

export const localizedStageSelector = createSelector(
  (stage: Stage | undefined) => stage || {},
  (stage: Stage | undefined) => (stage && stage.localized_pathway_stages) || [],
  (_: Stage | undefined, language: string) => language,
  (
    {
      name = '',
      description = '',
      self_followup_description = '',
    }: Partial<Stage>,
    localizedStages: LocalizedPathwayStage[],
    appLanguage: string,
  ) =>
    localizedStages.find(({ locale }) => locale === appLanguage) ||
    localizedStages.find(
      ({ locale }) => locale.split('-')[0] === appLanguage,
    ) || {
      locale: '',
      name,
      description,
      self_followup_description,
    },
);
