import impact from '../../src/reducers/impact';
import { REQUESTS } from '../../src/actions/api';
import { UPDATE_PEOPLE_INTERACTION_REPORT } from '../../src/constants';

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

it('should update interaction reports', () => {
  const state = impact(undefined, {
    type: UPDATE_PEOPLE_INTERACTION_REPORT,
    personId: '123',
    organizationId: '456',
    period: 'P1W',
    report: [
      {
        id: 100,
        requestFieldName: 'contact_count',
        iconName: 'peopleIcon',
        translationKey: 'interactionAssignedContacts',
        num: 1,
      },
    ],
  });

  expect(state).toMatchSnapshot();
});

it('should filter out contact_count and uncontacted_count for group', () => {
  const state = impact(undefined, {
    type: UPDATE_PEOPLE_INTERACTION_REPORT,
    personId: undefined,
    organizationId: '456',
    period: 'P1W',
    report: [
      {
        id: 100,
        requestFieldName: 'contact_count',
        iconName: 'peopleIcon',
        translationKey: 'interactionAssignedContacts',
        num: 1,
      },
      {
        id: 101,
        requestFieldName: 'uncontacted_count',
        iconName: 'uncontactedIcon',
        translationKey: 'interactionUncontacted',
        num: 1,
      },
      {
        id: 2,
        iconName: 'spiritualConversationIcon',
        translationKey: 'interactionSpiritualConversation',
        num: 1,
      },
    ],
  });

  expect(state).toMatchSnapshot();
});
