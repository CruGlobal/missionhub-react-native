import React from 'react';
import MockDate from 'mockdate';

import UnassignedPersonScreen from '../UnassignedPersonScreen';
import { INTERACTION_TYPES } from '../../../../constants';
import {
  renderShallow,
  createMockStore,
  testSnapshotShallow,
  createMockNavState,
} from '../../../../../testUtils';
import { addNewInteraction } from '../../../../actions/interactions';
import { getGroupJourney } from '../../../../actions/journey';
import { createContactAssignment } from '../../../../actions/person';

jest.mock('../../../../actions/interactions');
jest.mock('../../../../actions/journey', () => ({
  getGroupJourney: jest.fn(() => [{ id: '1' }]),
}));
jest.mock('../../../../actions/person', () => ({
  createContactAssignment: jest.fn(() => Promise.resolve()),
}));

MockDate.set('2017-06-18');
const me = { id: 'me' };
const store = createMockStore({
  auth: { person: me },
});

const organization = { id: '1', name: 'Test Org' };
const person = { id: '1', full_name: 'Test Person' };

const commentAction = Object.values(INTERACTION_TYPES).find(
  i => i.isOnAction && i.translationKey === 'interactionNote',
);
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

  it('should handleAssign correctly', async () => {
    const instance = renderShallow(component, store).instance();
    await instance.handleAssign();
    expect(createContactAssignment).toHaveBeenCalledWith(
      organization.id,
      me.id,
      person.id,
    );
  });

  it('should submit comment correctly', async () => {
    const data = { action: null, text: 'text' };
    const instance = renderShallow(component, store).instance();
    instance.loadFeed = jest.fn();

    await instance.submit(data);
    expect(addNewInteraction).toHaveBeenCalledWith(
      person.id,
      commentAction,
      data.text,
      organization.id,
    );
    expect(instance.loadFeed).toHaveBeenCalled();
  });

  it('should submit action correctly', async () => {
    const data = { action: spiritualConversationAction, text: 'text' };
    const instance = renderShallow(component, store).instance();
    instance.loadFeed = jest.fn();

    await instance.submit(data);
    expect(addNewInteraction).toHaveBeenCalledWith(
      person.id,
      spiritualConversationAction,
      data.text,
      organization.id,
    );
    expect(instance.loadFeed).toHaveBeenCalled();
  });

  it('should load the feed', async () => {
    const data = { action: spiritualConversationAction, text: 'text' };
    const instance = renderShallow(component, store).instance();

    await instance.loadFeed(data);
    expect(getGroupJourney).toHaveBeenCalledWith(person.id, organization.id);
    expect(instance.state.activity).toEqual([{ id: '1' }]);
  });
});
