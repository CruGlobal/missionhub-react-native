import React from 'react';
import MockDate from 'mockdate';

import Contact from '../Contact';
import { INTERACTION_TYPES } from '../../../constants';
import {
  renderShallow,
  createMockStore,
  testSnapshotShallow,
  createMockNavState,
} from '../../../../testUtils';
import { addNewInteraction } from '../../../actions/interactions';
import { reloadJourney } from '../../../actions/journey';
import { createContactAssignment } from '../../../actions/person';

jest.mock('../../../actions/interactions');
jest.mock('../../../actions/journey');
jest.mock('../../../actions/person', () => ({
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
    <Contact
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

    await instance.submit(data);
    expect(addNewInteraction).toHaveBeenCalledWith(
      person.id,
      commentAction,
      data.text,
      organization.id,
    );
    expect(reloadJourney).toHaveBeenCalledWith(person.id, organization.id);
  });

  it('should submit action correctly', async () => {
    const data = { action: spiritualConversationAction, text: 'text' };
    const instance = renderShallow(component, store).instance();

    await instance.submit(data);
    expect(addNewInteraction).toHaveBeenCalledWith(
      person.id,
      spiritualConversationAction,
      data.text,
      organization.id,
    );
    expect(reloadJourney).toHaveBeenCalledWith(person.id, organization.id);
  });
});
