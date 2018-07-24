import React from 'react';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';

import { testSnapshotShallow, renderShallow } from '../../testUtils';
import AssignToMeButton from '../../src/components/AssignToMeButton';
import { createContactAssignment } from '../../src/actions/person';
import { contactAssignmentSelector } from '../../src/selectors/people';
import { navigatePush } from '../../src/actions/navigation';
import { PERSON_STAGE_SCREEN } from '../../src/containers/PersonStageScreen';

jest.mock('../../src/actions/person');
jest.mock('../../src/selectors/people');
jest.mock('../../src/actions/navigation');

const myId = '25';
const state = { auth: { person: { id: myId } } };
const store = configureStore([thunk])(state);

const person = { id: '100', first_name: 'Roge' };
const personId = person.id;
const orgId = '800';
const props = {
  personId,
  orgId,
};

const createContactAssignmentResult = () => Promise.resolve({ person });
const contactAssignmentSelectorResult = { id: '1412' };
const navigateResult = { type: 'navigated' };

beforeEach(() => {
  createContactAssignment.mockReturnValue(createContactAssignmentResult);
  contactAssignmentSelector.mockReturnValue(contactAssignmentSelectorResult);
  navigatePush.mockReturnValue(navigateResult);
});

it('renders correctly', () => {
  testSnapshotShallow(<AssignToMeButton {...props} />, store);
});

it('creates a new contact assignment and navigates to the stage screen', async () => {
  const screen = renderShallow(<AssignToMeButton {...props} />, store);

  await screen.props().onPress();

  expect(store.getActions()).toEqual([navigateResult]);
  expect(createContactAssignment).toHaveBeenCalledWith(orgId, myId, personId);
  expect(contactAssignmentSelector).toHaveBeenCalledWith(state, {
    person,
    orgId,
  });
  expect(navigatePush).toHaveBeenCalledWith(PERSON_STAGE_SCREEN, {
    contactId: personId,
    orgId: orgId,
    contactAssignmentId: contactAssignmentSelectorResult.id,
    name: person.first_name,
    onComplete: expect.anything(),
    section: 'people',
    subsection: 'person',
  });
});
