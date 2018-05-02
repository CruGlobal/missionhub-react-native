import impact from '../../src/reducers/impact';
import { REQUESTS } from '../../src/actions/api';
import { UPDATE_PEOPLE_INTERACTION_REPORT } from '../../src/constants';

it('should update person impact reports', () => {
  const state = impact(undefined,
    {
      type: REQUESTS.GET_IMPACT_BY_ID.SUCCESS,
      results: {
        response: {
          type: 'impact_report',
          person_id: '123',
        },
      },
    },
  );

  expect(state).toMatchSnapshot();
});

it('should update global impact reports', () => {
  const state = impact(undefined,
    {
      type: REQUESTS.GET_GLOBAL_IMPACT.SUCCESS,
      results: {
        response: {
          type: 'impact_report',
        },
      },
    },
  );

  expect(state).toMatchSnapshot();
});

it('should update interaction reports', () => {
  const state = impact(undefined,
    {
      type: UPDATE_PEOPLE_INTERACTION_REPORT,
      personId: '123',
      organizationId: '456',
      period: 'P1W',
      report: [ {
        id: '100',
        requestFieldName: 'contact_count',
        iconName: 'peopleIcon',
        translationKey: 'interactionAssignedContacts',
        num: 1,
      } ],
    },
  );

  expect(state).toMatchSnapshot();
});
