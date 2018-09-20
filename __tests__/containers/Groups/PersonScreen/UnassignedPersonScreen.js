import React from 'react';
import MockDate from 'mockdate';

import UnassignedPersonScreen from '../../../../src/containers/Groups/UnassignedPersonScreen';
import { INTERACTION_TYPES } from '../../../../src/constants';
import {
  renderShallow,
  createMockStore,
  testSnapshotShallow,
  createMockNavState,
} from '../../../../testUtils';
import { getGroupJourney } from '../../../../src/actions/journey';

jest.mock('../../../../src/actions/journey', () => ({
  getGroupJourney: jest.fn(() => [{ id: '1' }]),
}));
jest.mock('../../../../src/actions/person', () => ({
  createContactAssignment: jest.fn(() => Promise.resolve()),
}));

MockDate.set('2017-06-18');
const me = { id: 'me' };
const store = createMockStore({
  auth: { person: me },
});

const organization = { id: '1', name: 'Test Org' };
const person = { id: '1', full_name: 'Test Person' };

const spiritualConversationAction = Object.values(INTERACTION_TYPES).find(
  i => i.isOnAction && i.translationKey === 'interactionSpiritualConversation',
);

describe('Contact', () => {
  const component = (
    <UnassignedPersonScreen
      navigation={createMockNavState({
        organization,
        person,
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
    expect(instance.state.activity).toEqual([{ id: '1' }]);
  });
});
