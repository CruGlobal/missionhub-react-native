import i18next from 'i18next';

import { getLocalizedStages } from '../stages';
import { Stage } from '../../reducers/stages';

const locale = 'en_TEST';
i18next.language = locale;

const localizedStage1 = {
  id: '11',
  locale,
  name: '1 Egats',
  description: 'Egats tsrif eht',
  self_followup_description: 'tsrif eht egats',
};
const localizedStage2 = {
  id: '22',
  locale,
  name: '2 Egats',
  description: 'Egats dnoces eht',
  self_followup_description: 'dnoces eht egats',
};

const stage1 = {
  id: '1',
  name: 'Stage 1',
  description: 'The first stage',
  self_followup_description: 'Stage the first',
  localized_pathway_stages: [localizedStage1],
};
const stage2 = {
  id: '2',
  name: 'Stage 2',
  description: 'The second stage',
  self_followup_description: 'Stage the second',
  localized_pathway_stages: [localizedStage2],
};

it('replaces stage text data with localized text', () => {
  const stages = ([stage1, stage2] as unknown) as Stage[];

  expect(getLocalizedStages(stages)).toEqual([
    {
      id: stage1.id,
      name: localizedStage1.name,
      description: localizedStage1.description,
      self_followup_description: localizedStage1.self_followup_description,
      locale,
      localized_pathway_stages: stage1.localized_pathway_stages,
    },
    {
      id: stage2.id,
      name: localizedStage2.name,
      description: localizedStage2.description,
      self_followup_description: localizedStage2.self_followup_description,
      locale,
      localized_pathway_stages: stage2.localized_pathway_stages,
    },
  ]);
});

it('does not replace stage text data if there are no localized stages', () => {
  const stages = ([
    { ...stage1, localized_pathway_stages: [] },
    { ...stage2, localized_pathway_stages: [] },
  ] as unknown) as Stage[];

  expect(getLocalizedStages(stages)).toEqual(stages);
});

it('does not replace stage text data if localized stages are not the right locale', () => {
  const stages = ([
    {
      ...stage1,
      localized_pathway_stages: [{ ...localizedStage1, locale: 'trk' }],
    },
    {
      ...stage2,
      localized_pathway_stages: [{ ...localizedStage2, locale: 'trk' }],
    },
  ] as unknown) as Stage[];

  expect(getLocalizedStages(stages)).toEqual(stages);
});
