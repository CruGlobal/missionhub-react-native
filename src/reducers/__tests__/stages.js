import { REQUESTS } from '../../actions/api';
import stages from '../stages';

it('loads step suggestions for me', () => {
  const newStages = [
    {
      id: '2',
      name: 'English Name',
      localized_pathway_stages: [
        { id: '3', locale: 'no', name: 'Norwegian Name' },
      ],
    },
  ];

  const state = stages(undefined, {
    type: REQUESTS.GET_STAGES.SUCCESS,
    results: { findAll: () => newStages },
  });

  expect(state.stages).toEqual(newStages);
  expect(state.stagesObj).toEqual({
    '2': newStages[0],
  });
});
