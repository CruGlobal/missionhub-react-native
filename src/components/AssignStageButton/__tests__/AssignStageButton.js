import React from 'react';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';

import { testSnapshotShallow, renderShallow } from '../../../../testUtils';
import {
  contactAssignmentSelector,
  personSelector,
} from '../../../selectors/people';

import AssignStageButton from '..';

jest.mock('../../../selectors/people');

const myId = '25';
const otherId = '52';
const stageId = '1';

const mockContactAssignment = {
  id: '123',
  pathway_stage_id: stageId,
};

contactAssignmentSelector.mockReturnValue(mockContactAssignment);

const state = {
  auth: { person: { id: myId, user: { pathway_stage_id: stageId } } },
  people: {},
  stages: {
    stages: [
      {
        id: stageId,
        name: 'Stage Name',
      },
    ],
  },
};
let store;

const props = {
  person: { id: '1' },
  organization: { id: '11' },
  selectMyStage: jest.fn(),
  selectPersonStage: jest.fn(),
};

beforeEach(() => {
  store = configureStore([thunk])(state);
});

it('renders correctly for me', () => {
  testSnapshotShallow(
    <AssignStageButton {...props} person={{ id: myId }} />,
    store,
  );
});

it('renders correctly for me without stage', () => {
  store = configureStore([thunk])({
    ...state,
    auth: {
      person: {
        id: myId,
        user: {},
      },
    },
  });

  testSnapshotShallow(
    <AssignStageButton {...props} person={{ id: myId }} />,
    store,
  );
});

it('renders correctly for other', () => {
  testSnapshotShallow(
    <AssignStageButton {...props} person={{ id: otherId }} />,
    store,
  );
});

it('renders correctly for other without stage', () => {
  contactAssignmentSelector.mockReturnValue({});
  testSnapshotShallow(
    <AssignStageButton {...props} person={{ id: otherId }} />,
    store,
  );
});
