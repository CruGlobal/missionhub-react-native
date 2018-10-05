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
let store;

const person = { id: '100', first_name: 'Roge' };
const organization = { id: '800' };
const props = {
  person: person,
  organization,
};

const assignResponse = { type: 'success' };

beforeEach(() => {
  store = configureStore([thunk])(state);
});

it('renders correctly', () => {
  testSnapshotShallow(<AssignToMeButton {...props} />, store);
});

describe('assignToMe', () => {
  assignContactAndPickStage.mockReturnValue(assignResponse);

  it('calls assignContactAndPickStage on press', async () => {
    const screen = renderShallow(<AssignToMeButton {...props} />, store);

    await screen.props().onPress();

    expect(assignContactAndPickStage).toHaveBeenCalledWith(
      person,
      organization,
      myId,
    );
    expect(store.getActions()).toEqual([assignResponse]);
  });

  it('calls assignContactAndPickStage and onComplete on press', async () => {
    const onComplete = jest.fn();
    const screen = renderShallow(
      <AssignToMeButton {...props} onComplete={onComplete} />,
      store,
    );

    await screen.props().onPress();

    expect(assignContactAndPickStage).toHaveBeenCalledWith(
      person,
      organization,
      myId,
    );
    expect(onComplete).toHaveBeenCalled();
    expect(store.getActions()).toEqual([assignResponse]);
  });
});
