import i18n from 'i18next';

import { REQUESTS } from '../../api/routes';
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

it('loads step suggestions for me by language', () => {
  const locale = 'no';
  i18n.language = locale;
  const newStages = [
    {
      id: '2',
      name: 'English Name',
      localized_pathway_stages: [
        { id: '3', locale: 'no', name: 'Norwegian Name' },
      ],
    },
  ];
  const expectedStages = [
    {
      id: '3',
      name: 'Norwegian Name',
      locale: 'no',
      localized_pathway_stages: [
        { id: '3', locale: 'no', name: 'Norwegian Name' },
      ],
    },
  ];

  const state = stages(undefined, {
    type: REQUESTS.GET_STAGES.SUCCESS,
    results: { findAll: () => newStages },
  });

  expect(state.stages).toEqual(expectedStages);
  expect(state.stagesObj).toEqual({
    '3': expectedStages[0],
  });
});
