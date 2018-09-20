import React from 'react';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';

import { testSnapshotShallow, renderShallow } from '../../testUtils';
import AssignToMeButton from '../../src/components/AssignToMeButton';
import { assignContactAndPickStage } from '../../src/actions/misc';

jest.mock('../../src/actions/misc');
jest.mock('../../src/actions/person');
jest.mock('../../src/selectors/people');
jest.mock('../../src/actions/navigation');

const myId = '25';
const state = { auth: { person: { id: myId } } };
const store = configureStore([thunk])(state);

const person = { id: '100', first_name: 'Roge' };
const organization = { id: '800' };
const props = {
  person: person,
  organization,
};

it('renders correctly', () => {
  testSnapshotShallow(<AssignToMeButton {...props} />, store);
});

it('calls assignContactAndPickStage on press', () => {
  const assignResponse = { type: 'success' };
  assignContactAndPickStage.mockReturnValue(assignResponse);
  const screen = renderShallow(<AssignToMeButton {...props} />, store);

  screen.props().onPress();

  expect(assignContactAndPickStage).toHaveBeenCalledWith(
    person,
    organization,
    myId,
  );
  expect(store.getActions()).toEqual([assignResponse]);
});
