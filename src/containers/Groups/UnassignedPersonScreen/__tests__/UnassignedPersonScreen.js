import React from 'react';
import MockDate from 'mockdate';

import UnassignedPersonScreen from '..';

import { INTERACTION_TYPES } from '../../../../constants';
import {
  renderShallow,
  createThunkStore,
  testSnapshotShallow,
  createMockNavState,
} from '../../../../../testUtils';
import { getGroupJourney } from '../../../../actions/journey';

jest.mock('../../../../actions/journey');
jest.mock('../../../../actions/person', () => ({
  createContactAssignment: jest.fn(() => Promise.resolve()),
}));

MockDate.set('2017-06-18');
const me = { id: 'me' };
const organization = { id: '1', name: 'Test Org' };
const person = { id: '1', full_name: 'Test Person' };

let store;

const state = {
  auth: { person: me },
  organizations: { all: [organization] },
  people: {
    allByOrg: {
      [organization.id]: {
        people: {
          [person.id]: person,
        },
      },
    },
  },
};

const spiritualConversationAction = Object.values(INTERACTION_TYPES).find(
  i => i.isOnAction && i.translationKey === 'interactionSpiritualConversation',
);
const groupJourneyResult = { id: '1' };

getGroupJourney.mockReturnValue(() => Promise.resolve(groupJourneyResult));

beforeEach(() => {
  store = createThunkStore(state);
});

describe('Contact', () => {
  const component = (
    <UnassignedPersonScreen
      navigation={createMockNavState({
        organization,
        person,
        onAssign: jest.fn(),
      })}
    />
  );

  it('should render correctly', () => {
    testSnapshotShallow(component, store);
  });

  it('should load the feed', async () => {
    const data = { action: spiritualConversationAction, text: 'text' };
    const instance = renderShallow(component, store).instance();

    await instance.loadFeed(data);
    expect(getGroupJourney).toHaveBeenCalledWith(person.id, organization.id);
    expect(instance.state.activity).toEqual(groupJourneyResult);
  });
});
