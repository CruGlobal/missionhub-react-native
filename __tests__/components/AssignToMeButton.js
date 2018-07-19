import React from 'react';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';

import { testSnapshotShallow } from '../../testUtils';
import AssignToMeButton from '../../src/components/AssignToMeButton';

const myId = '25';
const store = configureStore([thunk])({
  auth: { person: { id: myId } },
});

const props = {
  personId: '100',
  orgId: '800',
};

it('renders correctly', () => {
  testSnapshotShallow(<AssignToMeButton {...props} />, store);
});
