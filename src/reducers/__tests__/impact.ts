import impact from '../impact';
import { REQUESTS } from '../../api/routes';

it('should update person impact reports', () => {
  const state = impact(undefined, {
    type: REQUESTS.GET_IMPACT_SUMMARY.SUCCESS,
    results: {
      response: {
        type: 'impact_report',
        person_id: '123',
        organization_id: null,
      },
    },
  });

  expect(state).toMatchSnapshot();
});

it('should update group impact reports', () => {
  const state = impact(undefined, {
    type: REQUESTS.GET_IMPACT_SUMMARY.SUCCESS,
    results: {
      response: {
        type: 'impact_report',
        person_id: null,
        organization_id: '1234',
      },
    },
  });

  expect(state).toMatchSnapshot();
});

it('should update global impact reports', () => {
  const state = impact(undefined, {
    type: REQUESTS.GET_IMPACT_SUMMARY.SUCCESS,
    results: {
      response: {
        type: 'impact_report',
        person_id: null,
        organization_id: null,
      },
    },
  });

  expect(state).toMatchSnapshot();
});
