import i18n from 'i18next';

import { REQUESTS } from '../../api/routes';
import stages from '../stages';

const localizedStage = {
  id: '3',
  locale: 'no',
  name: 'Norwegian Name',
  description: 'Norwegian Description',
  self_followup_description: 'Norwegian Self Description',
};
const stage = {
  id: '2',
  name: 'English Name',
  description: 'English Description',
  self_followup_description: 'English Self Description',
  localized_pathway_stages: [localizedStage],
};

const newStages = [stage];

it('loads stages', () => {
  const state = stages(undefined, {
    type: REQUESTS.GET_STAGES.SUCCESS,
    results: { findAll: () => newStages },
  });

  expect(state).toEqual({
    stages: newStages,
    stagesObj: { '2': stage },
  });
});

it('loads stages with different locale', () => {
  const locale = 'no';
  i18n.language = locale;

  const modifiedStage = {
    ...stage,
    name: localizedStage.name,
    description: localizedStage.description,
    self_followup_description: localizedStage.self_followup_description,
  };

  const state = stages(undefined, {
    type: REQUESTS.GET_STAGES.SUCCESS,
    results: { findAll: () => newStages },
  });

  expect(state).toEqual({
    stages: [modifiedStage],
    stagesObj: { '2': modifiedStage },
  });
});
