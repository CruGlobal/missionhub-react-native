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
  position: 1,
  name: 'English Name',
  name_i18n: 'English Name',
  description: 'English Description',
  description_i18n: 'English Description',
  self_followup_description: 'English Self Description',
  localized_pathway_stages: [localizedStage],
  icon_url: '',
};

const newStages = [stage];

it('loads stages', () => {
  const state = stages(undefined, {
    type: REQUESTS.GET_STAGES.SUCCESS,
    results: { response: newStages },
  });

  expect(state).toEqual({
    stages: newStages,
    stagesObj: { '2': stage },
  });
});
